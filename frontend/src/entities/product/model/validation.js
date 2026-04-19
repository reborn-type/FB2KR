import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, "Введите название товара"),
    price: z.preprocess((val) => Number(val), z.number().positive("Цена должна быть больше 0")),
    category: z.string().min(1, "Выберите категорию"),
    description: z.string().min(1, "Введите описание"),
    count: z.preprocess((val) => Number(val), z.number().min(0, "Количество не может быть отрицательным")),
});