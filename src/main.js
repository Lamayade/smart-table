import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {initFiltering} from "./components/filtering.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initSearching} from "./components/searching.js";
import {initTable} from "./components/table.js";
import {processFormData} from "./lib/utils.js";

const API = initData();
/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    const totalFrom = state.totalFrom ? Number(state.totalFrom) : undefined;
    const totalTo = state.totalTo ? Number(state.totalTo) : undefined;
    return {
        ...state,
        rowsPerPage,
        page,
        total: [totalFrom, totalTo],
    }; 
}
/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState();
    let query = {};
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    const {total, items} = await API.getRecords(query);
    updatePagination(total, query);
    sampleTable.render(items);
}
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);
const {applyPagination, updatePagination} = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
const applySearching = initSearching('search');
const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await API.getIndexes();
    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}
init()
.then(render);
//выключение изменения порядка сортировки при нажатии энтера
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            render();
        }
    });
});
