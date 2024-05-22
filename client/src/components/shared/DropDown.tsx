import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { startTransition, useState, useEffect } from "react";
import { Input } from "../ui/input";
import type { Icategory } from "@/types";
import { getAllCategories, createCategory } from "@/lib/category";

type DropDownProps = {
  value?: string;
  onChangeHandler: () => void;
};

const DropDown = ({ onChangeHandler, value }: DropDownProps) => {
  const [categories, setCategories] = useState<Icategory[]>([]);

  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = () => {
    createCategory({
      categoryName: newCategory.trim(),
    }).then((category) => {
      setCategories((prevState) => [...prevState, category]);
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as Icategory[]);
    };

    getCategories();
  }, []);

  return (
    <Select defaultValue={value} onValueChange={onChangeHandler}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Selecy Category" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => {
            return (
              <SelectItem
                value={category.id}
                key={category.id}
                className="select-item p-regular-14"
              >
                {category.name}
              </SelectItem>
            );
          })}

        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 hover:bg-slate-200">
            Add category
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Add new category</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Category name"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Add
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default DropDown;
