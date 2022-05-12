;"use strict";

(function todoList() {
    const INACTIVE_INDEX = -1;
    // метод получает значение из класса и записывает в переменную
    // tip = Цели(категории) task = Задачи (привязаны к целям)
    let tipTxt = document.querySelector('#tip'),
        tipBut = document.querySelector('#tipAdd'),
        tip = document.querySelector('#tipLi'),
        taskTxt = document.querySelector('#task'),
        taskBut = document.querySelector('#taskAdd'),
        task = document.querySelector('#taskLi')
    ;

    //Создаем двумерный массив для целей и задач в виде объекта из двух массивов которые будут содрежать объекты
    let data = {
        'tip': [],
        'task': [],
        tipActivIndex: INACTIVE_INDEX
    };

    //Элементы верстки
    //Цели
    const getHtmlTip = (item, i) => {
        return `
        <li id="tip_${i}" ${item.select ? 'class="select"' : ''}>
        <div class="dell" id="tipD_${i}"></div>${item.text}
        </li>
        `
    };

    //Задачи
    const getHtmlTask = (item, i) => {
        return `
        <li id="tas_${i}" ${item.chek ? 'class="chek"' : ''}>
        <div class="dell" id="tasD_${i}"></div>${item.text}
        </li>
        `
    };

    //метод вывода
    const output = () => {
        let outputTip = '';
        //если массив целей пуст выводи пустоту
        if (!data.tip.length) {
            tip.innerHTML = '';
            data.tipActivIndex = INACTIVE_INDEX;
            //сохраняем данные в локал сторедж
            localStorage.setItem('data', JSON.stringify(data));
        };
        //сканируем массив целей и выводим строку li для каждого элемента массива
        data.tip.forEach((item, i) => {
            outputTip += getHtmlTip(item, i);
            //console.log(i)
        });
        tip.innerHTML = outputTip;
        //То же самое для задач, задачи привязаны к целям
        // Проверяем есть ли задачи для выбранной цели. Фильтруем массив задач по активному индексу и проверяем его длинну
        if (!data.task.filter(el => el.tip === data.tipActivIndex).length) {
            task.innerHTML = '';
        } else {
            const outputTask = data.task.reduce((acc, item, i) => {
                const temp = data.tipActivIndex === item.tip ? getHtmlTask(item, i) : '';
                return  `${acc}${temp}`;
            }, '' );
            task.innerHTML = outputTask;
        };
    };

    // Стрелочные функци обработчиков событий нажатий
    // метод обработки нажатия кнопки получаем введенное название цели
    const addTip = () => {
        if (/^.*[A-Za-zА-Яа-яёЁ]{3,}.*$/.test(tipTxt.value)) {
            tipTxt.value = tipTxt.value.replace(/\s{2,}/g, ' ');
            tipTxt.value = tipTxt.value.replace(/^\s{1,}/, '');
            let newTip = {
                text: tipTxt.value,
                select: false
            };
            //Записываем новую цель в главный массив
            data.tip.push(newTip);
            //сохраняем данные в локал сторедж
            localStorage.setItem('data', JSON.stringify(data));
            //очищаем поле воода
            tipTxt.value = '';
            output();
        };
    };

    // метод обработки нажатия на кнопку добавить задачу
    const addTask = () => {
        if (data.tipActivIndex === INACTIVE_INDEX) {
            alert("Для ввода задачи выберите цель")
        } else if (/^.*[A-Za-zА-Яа-яёЁ]{3,}.*$/.test(taskTxt.value)) {
            taskTxt.value = taskTxt.value.replace(/\s{2,}/g, ' ');
            taskTxt.value = taskTxt.value.replace(/^\s{1,}/, '');
            let newTask = {
                tip: data.tipActivIndex,
                text: taskTxt.value,
                chek: false
            };
            //console.log(newTask);
            data.task.push(newTask);
            //сохраняем данные в локал сторедж
            localStorage.setItem('data', JSON.stringify(data));
            //очищаем поле воода
            taskTxt.value = '';
            output();
        };
    };

    // Метод выбора и удаление целей
    const selectDellTip = (event) => {
        //получаем ID элемента LI
        let tipLi=event.target.getAttribute('id');
        console.log(tipLi);
        //Проверка на что нажали удалить или выделить
        if (tipLi.search("tip_") !== INACTIVE_INDEX) {
            //отбрасываем текстовую часть tip_
            tipLi = tipLi.slice(4);
            //преобразуем в число
            tipLi = Number.parseInt(tipLi);
            //устанавливаем значение false всем целям
            data.tip.forEach((item) => {
                item.select = false;
            });
            //устанавливаем значение true выбранной цели
            data.tip[tipLi].select = true;
            data.tipActivIndex = tipLi;
        } else {
            // отбрасываем текстовую часть tipD_
            tipLi = tipLi.slice(5);
            // преобразуем в число
            tipLi = Number.parseInt(tipLi);
            // Удаляем элемент из массива
            data.tip.splice(tipLi, 1);
            // удаляем связанные задачи. С помощью фильтра оставляем элементы в которых ID не равен ID удаленной задачи
            data.task = data.task.filter((item) => item.tip !== tipLi);
        };
        // сохраняем данные в локал сторедж
        localStorage.setItem('data', JSON.stringify(data));
        console.log(JSON.stringify(data));
        // Выводим на экран, Ура!!! заработало!!!
        output()
    };

    //Метод выбора и удаление задач
    const selectDellTask = (event) => {
        //получаем ID элемента LI
        let taskLi = event.target.getAttribute('id');
        console.log(taskLi);
        //Проверка на что нажали удалить или пометить
        if (taskLi.search("tas_") !== INACTIVE_INDEX) {
            //отбрасываем текстовую часть tas_
            taskLi = taskLi.slice(4);
            //преобразуем в число
            taskLi = Number.parseInt(taskLi);
            //инвертируем статус задачи
            data.task[taskLi].chek = !data.task[taskLi].chek;
        } else {
            //отбрасываем текстовую часть tasD_
            taskLi = taskLi.slice(5);
            //преобразуем в число
            taskLi = Number.parseInt(taskLi);
            //Удаляем элемент из массива
            data.task.splice(taskLi, 1);
            
        };
        //сохраняем данные в локал сторедж
        localStorage.setItem('data', JSON.stringify(data));
        console.log(JSON.stringify(data));
        // Выводим на экран
        output()
        
    };

    //Ход программы

    //проверяем есть ли что то в БД и если есть то заполниема массив data и выводим на экран
    if(localStorage.getItem('data')){
        data = JSON.parse(localStorage.getItem('data'));
        output();
    };
    //кнопка добавить цель
    tipBut.addEventListener('click', addTip);
    tipTxt.addEventListener('keyup', event => {
        if(event.code === 'Enter') {
            addTip();
        };
    });
    //кнопка добавить задачу
    taskBut.addEventListener('click', addTask);
    taskTxt.addEventListener('keyup', event => {
        if(event.code === 'Enter') {
            addTask();
        };
    });
    //Выбор или удаление цели
    tip.addEventListener('click', selectDellTip);
    //помечаем или удаляем задачи
    task.addEventListener('click', selectDellTask);
}());