import Plan from "../models/planModel";
import Customer from "../models/customerModel"; // Assuming customers are linked to plans
import { validationResult } from "express-validator";

// 1. **Create a Plan**
export const createPlan = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, speed, duration, price, description } = req.body;

    const newPlan = new Plan({
      name,
      speed,
      duration,
      price,
      description,
    });

    // Save to database
    const savedPlan = await newPlan.save();
    return res.status(201).json({
      message: "Plan created successfully",
      plan: savedPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 2. **Get All Plans**
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    return res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3. **Get Plan by ID**
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.status(200).json({ plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 4. **Update Plan**
export const updatePlan = async (req, res) => {
  try {
    const { name, speed, duration, price, description } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      { name, speed, duration, price, description },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 5. **Delete Plan**
export const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 6. **Get Plans by Criteria (e.g., Speed, Price, Duration)**
export const getPlansByCriteria = async (req, res) => {
  try {
    const { speed, minPrice, maxPrice } = req.query;

    const query = {};
    if (speed) query.speed = speed;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { $lte: maxPrice };

    const plans = await Plan.find(query);
    return res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 7. **Subscribe to a Plan**
export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const customer = await Customer.findById(req.user.id); // Assuming req.user is the authenticated customer
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.subscribedPlan = planId; // Assuming there's a field to store the subscribed plan ID
    await customer.save();

    return res.status(200).json({
      message: "Subscription successful",
      customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 8. **Get Customer's Current Plan**
export const getCustomerCurrentPlan = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate(
      "subscribedPlan"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const plan = customer.subscribedPlan;
    return res.status(200).json({ plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 9. **Renew Subscription**
export const renewSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.subscribedPlan = planId;
    await customer.save();

    return res.status(200).json({
      message: "Subscription renewed successfully",
      customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 10. **Check Plan Expiry**
export const checkPlanExpiry = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate(
      "subscribedPlan"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const plan = customer.subscribedPlan;
    if (!plan) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    // Assuming there is a field like `expiryDate` in the plan or customer
    const currentDate = new Date();
    const expiryDate = new Date(customer.subscriptionExpiryDate); // Assuming this field exists
    if (expiryDate < currentDate) {
      return res.status(200).json({ message: "Plan has expired" });
    }

    return res.status(200).json({ message: "Plan is active" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
