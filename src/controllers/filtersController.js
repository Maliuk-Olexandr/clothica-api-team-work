import { getFilterParamsCache } from "../utils/getFilterParamsCach.js";

export const getFilters = async (req, res) => {
  try {
    const meta = await getFilterParamsCache();
    res.status(200).json(meta);
  } catch (error) {
    console.error("Error fetching filter parameters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
