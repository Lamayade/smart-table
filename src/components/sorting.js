import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    let field = null;
    let order = null;
    return (query, state, action) => { 
        if (action && action.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            columns.forEach(column => { 
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            }); 
        }
        const sort = (field && order !== 'none') ? `${field}:${order}` : null;
        return sort ? Object.assign({}, query, { sort }) : query;
    }
}