import React, { useEffect, useState, useCallback } from "react";

export default function ProductModal({open, mode, initialProduct, onClose, onSubmit}){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [countInStock, setCountInStock] = useState("");
    
    useEffect(() => {
        if (open) {
            setName(initialProduct?.name ?? "");
            setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
            setCategory(initialProduct?.category ?? "");
            setDescription(initialProduct?.description ?? "");
            setCountInStock(initialProduct?.countInStock != null ? String(initialProduct.countInStock) : "");
        }
    }, [open, initialProduct]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const parsedPrice = Number(price);
        const trimmedCategory = category.trim();
        const trimmedDescription = description.trim();
        const parsedCount = Number(countInStock);
        
        if (!trimmedName) return alert("Введите название товара.");
        if (isNaN(parsedPrice) || parsedPrice <= 0) return alert("Введите корректную цену.");
        if (!trimmedCategory) return alert("Выберите категорию товара.");
        if (!trimmedDescription) return alert("Введите описание.");
        if (isNaN(parsedCount) || parsedCount < 0) return alert("Введите количество товара.");

        onSubmit({
            id: initialProduct?.id,
            name: trimmedName,
            price: parsedPrice,
            category: trimmedCategory,
            description: trimmedDescription,
            count: parsedCount,
        });
    }, [name, price, category, description, countInStock, initialProduct, onSubmit]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Создание товара"; 

return (
    <div className="backdrop" onMouseDown={onClose}>
        <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal__header">
            <div className="modal__title">{title}</div>
            <button className="iconBtn" onClick={onClose} arialabel="Закрыть">
                ✕
            </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
            <label className="label">
                Название
                <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Marcelo Miracles Lazer Jacker"
                autoFocus
                />
            </label>

            <label className="label">
                Цена
                <input
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Например, 1000"
                inputMode="numeric"
                />
            </label>

            <label className="label">
                Категория
            <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Выберите категорию</option>
                <option value="верхняя одежда">Верхняя одежда</option>
                <option value="низ">Низ</option>
                <option value="нижнее белье">Нижнее белье</option>
                <option value="аксессуары">Аксессуары</option>
                <option value="обувь">Обувь</option>
            </select>
            </label>

            <label className="label">
                Описание
                <input
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например, Черная футболка [52 RU]"
                />
            </label>

            <label className="label">
                Количество
                <input
                className="input"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Например, 23"
                inputMode="numeric"
                />
            </label>

            <div className="modal__footer">
                <button type="button" className="btn" onClick={onClose}>
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
};