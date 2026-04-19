import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"; 
import { productSchema } from "../entities/product/model/validation";

export default function ProductModal({open, mode, initialProduct, onClose, onSubmit}){
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(productSchema),
        values: initialProduct, 
    });

    useEffect(() => {
        if (!open) reset({});
    }, [open, reset]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Создание товара";

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register("id")} />
                    <label className="label">
                        Название
                        <input 
                            className={`input ${errors.name ? 'input--error' : ''}`}
                            {...register("name")} 
                            placeholder="Например, Marcelo Miracles"
                        />
                        {errors.name && <span className="error">{errors.name.message}</span>}
                    </label>

                    <label className="label">
                        Цена
                        <input 
                            className="input" 
                            type="number"
                            {...register("price")} 
                        />
                        {errors.price && <span className="error">{errors.price.message}</span>}
                    </label>

                    <label className="label">
                        Категория
                        <select className="select" {...register("category")}>
                            <option value="">Выберите категорию</option>
                            <option value="верхняя одежда">Верхняя одежда</option>
                            <option value="обувь">Обувь</option>
                        </select>
                        {errors.category && <span className="error">{errors.category.message}</span>}
                    </label>

                    <label className="label">
                        Описание
                        <input className="input" {...register("description")} />
                        {errors.description && <span className="error">{errors.description.message}</span>}
                    </label>

                    <label className="label">
                        Количество
                        <input className="input" type="number" {...register("count")} />
                        {errors.count && <span className="error">{errors.count.message}</span>}
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={() => { reset(); onClose(); }}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}