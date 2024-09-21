import { Bed } from '../models/bed.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBed = asyncHandler(async (req, res, next) => {
    const { bedNumber, bedType, availabilityStatus } = req.body;

    const newBed = new Bed({
        bedNumber,
        bedType,
        availabilityStatus,
    });

    await newBed.save();

    res.status(201).json(new ApiResponse(201, newBed, "Bed created successfully"));
});

export const getAllBeds = asyncHandler(async (req, res, next) => {
    const beds = await Bed.find();
    res.status(200).json(new ApiResponse(200, beds, "List of all beds"));
});

export const updateBedStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.bed?._id;
    const { availabilityStatus } = req.body;

    const bed = await Bed.findByIdAndUpdate(id, { availabilityStatus }, { new: true });

    if (!bed) {
        return next(new ApiError(404, "Bed not found"));
    }

    res.status(200).json(new ApiResponse(200, bed, "Bed status updated successfully"));
});

export const deleteBed = asyncHandler(async (req, res, next) => {
    const { id } = req.bed?._id;
    const bed = await Bed.findByIdAndDelete(id);

    if (!bed) {
        return next(new ApiError(404, "Bed not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Bed deleted successfully"));
});
