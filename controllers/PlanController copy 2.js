import Plan from '../models/planModel';
import PlanCategory from '../models/PlanCategory';
import { validationResult } from 'express-validator';

// Create a Plan
export const createPlan = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      internetSpeed,
      internetSpeedUnit,
      duration,
      price,
      description,
      category,
      dataLimitType,
      dataLimit,
      features,
      Plancategories,
      isActive,
      featured,
    } = req.body;

    // Validate if categories exist
    if (Plancategories && Plancategories.length > 0) {
      const categories = await PlanCategory.find({
        _id: { $in: Plancategories },
      });
      if (categories.length !== Plancategories.length) {
        return res
          .status(400)
          .json({ message: 'One or more plan categories do not exist' });
      }
    }

    const newPlan = new Plan({
      name,
      internetSpeed,
      internetSpeedUnit,
      duration,
      price,
      description,
      category,
      dataLimitType,
      dataLimit,
      features,
      Plancategories,
      isActive: isActive || true,
      featured: featured || false,
    });

    // Save to database
    const savedPlan = await newPlan.save();
    return res.status(201).json({
      message: 'Plan created successfully',
      plan: savedPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().populate('Plancategories'); // Populating category references
    return res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate('Plancategories');
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json({ plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const {
      name,
      internetSpeed,
      internetSpeedUnit,
      duration,
      price,
      description,
      category,
      dataLimitType,
      dataLimit,
      features,
      Plancategories,
      isActive,
      featured,
    } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        name,
        internetSpeed,
        internetSpeedUnit,
        duration,
        price,
        description,
        category,
        dataLimitType,
        dataLimit,
        features,
        Plancategories,
        isActive: isActive !== undefined ? isActive : true,
        featured: featured !== undefined ? featured : false,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    return res.status(200).json({
      message: 'Plan updated successfully',
      plan: updatedPlan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPlansByCriteria = async (req, res) => {
  try {
    const { internetSpeed, minPrice, maxPrice, category } = req.query;

    const query = {};
    if (internetSpeed) query.internetSpeed = internetSpeed;
    if (minPrice) query.price = { $gte: minPrice };
    if (maxPrice) query.price = { $lte: maxPrice };
    if (category) query.category = category;

    const plans = await Plan.find(query).populate('Plancategories');
    return res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.subscribedPlan = planId;
    await customer.save();

    return res.status(200).json({
      message: 'Subscription successful',
      customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getCustomerCurrentPlan = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).populate(
      'subscribedPlan'
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const plan = customer.subscribedPlan;
    return res.status(200).json({ plan });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
