export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName])
                        .map(name => {
                            const option = document.createElement('option');
                            option.value = name;
                            option.textContent = name;
                            return option;
                        })
            )
        })
    }
    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const input = action.parentElement.querySelector('input');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
            render();
        }
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
                    filter[`filter[${elements[key].name}]`] = elements[key].value;
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query;
    }
    return {
        updateIndexes,
        applyFiltering
    }
}