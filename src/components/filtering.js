import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
    .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                    .map(name => {                        // используйте name как значение и текстовое содержимое
                        const option = document.createElement('option');
                        option.value = name;  // значение
                        option.textContent = name; // текст
                        return option;                                 // @todo: создать и вернуть тег опции
                    })
        )
    }) 
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        if (action && action.name === 'clear') {
            // Получаем кнопку, по которой кликнули
            const button = action.target;

            // Находим родительский элемент кнопки
            const parent = button.closest('.filter-field'); // или parentNode, если структура проще

            // Находим input внутри родителя
            const input = parent.querySelector('input, select'); // поддержка <input> и <select>

            if (input) {
                // Сбрасываем значение поля
                input.value = '';

                // Узнаём имя поля из data-field кнопки
                const fieldName = button.dataset.field;

                // Обновляем соответствующее значение в state
                state[fieldName] = '';
            }

            // После очистки нужно обновить таблицу
            render();
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}