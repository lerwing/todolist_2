;"use strict";

(function todoList() {
    const INACTIVE_INDEX = -1;
    // метод получает значение из класса и записывает в переменную
    // tip = Цели(категории, тип задач) task = Задачи (привязаны к целям)
    let inputTipText = document.querySelector('#input_tip'),
        tipBtn = document.querySelector('#tipAdd'),
        tip = document.querySelector('#tipLi'),
        inputTaskText = document.querySelector('#input_task'),
        taskBtn = document.querySelector('#taskAdd'),
        task = document.querySelector('#taskLi')
    ;

    //Создаем двумерный массив для целей и задач в виде объекта из двух массивов которые будут содрежать объекты
    let dataTodo = {
        'tip': [],
        'task': [],
        tipActivIndex: INACTIVE_INDEX
    };

    //Элементы верстки
    //Цели
    const getHtmlTip = (tip, i) => {
        return `
        <li id="tip_${i}" class="${tip.select ? 'list__text list__text_select' : 'list__text'}">
        <button class="btn-dell" id="tipD_${i}"></button>${tip.text}
        </li>
        `
    };

    //Задачи
    const getHtmlTask = (task, i) => {
        return `
        <li id="tas_${i}" class="${task.complete ? 'list__text list__text_compleat' : 'list__text'}">
        <button class="btn-dell" id="tasD_${i}"></button>${task.text}
        </li>
        `
    };

    //метод вывода
    const output = () => {
        let outputTip = '';
        //если массив целей пуст выводи пустоту
        if (!dataTodo.tip.length) {
            tip.innerHTML = '';
            dataTodo.tipActivIndex = INACTIVE_INDEX;
            //сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
        };
        //сканируем массив целей и выводим строку li для каждого элемента массива
        dataTodo.tip.forEach((item, i) => {
            outputTip += getHtmlTip(item, i);
            //console.log(i)
        });
        tip.innerHTML = outputTip;
        //То же самое для задач, задачи привязаны к целям
        // Проверяем есть ли задачи для выбранной цели. Фильтруем массив задач по активному индексу и проверяем его длинну
        if (!dataTodo.task.filter(el => el.tip === dataTodo.tipActivIndex).length) {
            task.innerHTML = '';
        } else {
            const outputTask = dataTodo.task.reduce((acc, item, i) => {
                return  `${acc}${dataTodo.tipActivIndex === item.tip ? getHtmlTask(item, i) : ''}`;
            }, '' );
            task.innerHTML = outputTask;
        };
    };

    // Стрелочные функци обработчиков событий нажатий
    // метод обработки нажатия кнопки получаем введенное название цели
    const addTip = () => {
        if (/^.*[A-Za-zА-Яа-яёЁ]{3,}.*$/.test(inputTipText.value)) {
            inputTipText.value = inputTipText.value.replace(/\s{2,}/g, ' ');
            inputTipText.value = inputTipText.value.replace(/^\s{1,}/, '');
            let newTip = {
                text: inputTipText.value,
                select: false
            };
            //Записываем новую цель в главный массив
            dataTodo.tip.push(newTip);
            //сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            //очищаем поле воода
            inputTipText.value = '';
            output();
        };
    };

    // метод обработки нажатия на кнопку добавить задачу
    const addTask = () => {
        if (dataTodo.tipActivIndex === INACTIVE_INDEX) {
            alert("Для ввода задачи выберите цель")
        } else if (/^.*[A-Za-zА-Яа-яёЁ]{3,}.*$/.test(inputTaskText.value)) {
            inputTaskText.value = inputTaskText.value.replace(/\s{2,}/g, ' ');
            inputTaskText.value = inputTaskText.value.replace(/^\s{1,}/, '');
            let newTask = {
                tip: dataTodo.tipActivIndex,
                text: inputTaskText.value,
                complete: false
            };
            //console.log(newTask);
            dataTodo.task.push(newTask);
            //сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            //очищаем поле воода
            inputTaskText.value = '';
            output();
        };
    };

    // Метод выбора целей
    const selectTip = (event) => {
        //получаем ID элемента LI
        let tipId=event.target.getAttribute('id');
        console.log(tipId);
        if (tipId.search("tip_") !== INACTIVE_INDEX) {
            //отбрасываем текстовую часть tip_
            tipId = tipId.slice(4);
            //преобразуем в число
            tipId = Number.parseInt(tipId);
            //устанавливаем значение false всем целям
            dataTodo.tip.forEach((item) => {
                item.select = false;
            });
            //устанавливаем значение true выбранной цели
            dataTodo.tip[tipId].select = true;
            dataTodo.tipActivIndex = tipId;
            // сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            console.log(JSON.stringify(dataTodo));
            // Выводим на экран
            output();
        };
    };

    // Метод удаление целей
    const removeTip  = (event) => {
        let tipId=event.target.getAttribute('id');
        if (tipId.search("tipD_") !== INACTIVE_INDEX) {
            // отбрасываем текстовую часть tipD_
            tipId = tipId.slice(5);
            // преобразуем в число
            tipId = Number.parseInt(tipId);
            // Удаляем элемент из массива
            dataTodo.tip.splice(tipId, 1);
            // удаляем связанные задачи. С помощью фильтра оставляем элементы в которых ID не равен ID удаленной задачи
            dataTodo.task = dataTodo.task.filter((item) => item.tip !== tipId);
            // сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            // Выводим на экран
            output();
        };
    };

    //Метод помечает задачи как выполненные
    const selectTask = (event) => {
        //получаем ID элемента LI
        let taskId = event.target.getAttribute('id');
        console.log(taskId);
        if (taskId.search("tas_") !== INACTIVE_INDEX) {
            //отбрасываем текстовую часть tas_
            taskId = taskId.slice(4);
            //преобразуем в число
            taskId = Number.parseInt(taskId);
            //инвертируем статус задачи
            dataTodo.task[taskId].complete = !dataTodo.task[taskId].complete;
            //сохраняем данные в локал сторедж
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            // Выводим на экран
            output();
        };
    };
    //Метод удаление задач
    const removeTask = (event) => {
        let taskId = event.target.getAttribute('id');
        if (taskId.search("tasD_") !== INACTIVE_INDEX) {
            taskId = taskId.slice(5);
            taskId = Number.parseInt(taskId);
            dataTodo.task.splice(taskId, 1);
            localStorage.setItem('dataTodo', JSON.stringify(dataTodo));
            output();
        };
    };

    //Ход программы

    //проверяем есть ли что то в БД и если есть то заполниема массив dataTodo и выводим на экран
    if(localStorage.getItem('dataTodo')){
        dataTodo = JSON.parse(localStorage.getItem('dataTodo'));
        output();
    };
    //кнопка добавить цель
    tipBtn.addEventListener('click', addTip);
    inputTipText.addEventListener('keyup', event => {
        if(event.code === 'Enter') {
            addTip();
        };
    });
    //кнопка добавить задачу
    taskBtn.addEventListener('click', addTask);
    inputTaskText.addEventListener('keyup', event => {
        if(event.code === 'Enter') {
            addTask();
        };
    });
    //Выбор или удаление цели
    tip.addEventListener('click', selectTip);
    tip.addEventListener('click', removeTip);
    //помечаем или удаляем задачи
    task.addEventListener('click', selectTask);
    task.addEventListener('click', removeTask);
}());