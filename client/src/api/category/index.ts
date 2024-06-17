import { Icategory, CreateCategoryParams } from "@/types";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllCategories = async () => {
  try {
    const data = await axios.get(`${BASE_URL}/api/categories`);
    const categories: Icategory[] = data.data;
    return categories;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    const data = await axios.post(`${BASE_URL}/api/categories`, {
      name: categoryName,
    });

    const category = data.data;
    return category;
  } catch (error) {
    console.error(error);
    return [];
  }
};
