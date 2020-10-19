window.addEventListener('DOMContentLoaded', () => {

    //Устанавливаем ширину блока с изображениями - зависит от числа img
    const widthSliderBlock = (sliderBlockAll) => {
        sliderBlockAll.forEach(el => {
            el.style.width = `${100 / sliderBlockAll.length}%`
        })
    }

    //Создаем интерфейс управления - кнопки вперед \ назад, точки для перехода к слайдам
    const createControlUI = (slider, countImg) => {
        const controlPrev = document.createElement('div')
        controlPrev.classList.add('slider__control', 'slider__control-prev')

        const controlNext = document.createElement('div')
        controlNext.classList.add('slider__control', 'slider__control-next')

        const controlPanel = document.createElement('div')
        controlPanel.classList.add('slider__control-panel')

        slider.appendChild(controlPrev)
        slider.appendChild(controlNext)


        for (let i = 0; i < countImg; i++) {

            const controlDot = document.createElement('div')
            controlDot.classList.add('slider__control-dot');
            (i === 0 && controlDot.classList.add('slider__control-dot_active'))
            controlPanel.appendChild(controlDot)
        }

        slider.appendChild(controlPanel)

    }

    //для отслеживания запущенного интервала
    let interval

    //Функция для управления перехода от слайда к слайду
    //sliderWrapper - слайды
    //timer время в ms
    //action - действие (+ вперед \ - назад)
    //shift - на сколько нужно сделать сдвиг
    const controlSlide = (sliderWrapper, timer, isForwardDirection, shift = 1) => {
        let count = 1
        const timeout = 5
        const countTarget = (timer / timeout)
        const shiftStep = (shift * 100) / countTarget
        console.log(shiftStep)
        const action = (isForwardDirection) ? '-' : '+'
        interval = setInterval(() => {
            if (count === countTarget) {
                clearInterval(interval)
                interval = null
            }
            const currentStyleLeft = Number(sliderWrapper.style.left.replace('%', ''))
            sliderWrapper.style.left = `${eval(`${currentStyleLeft} ${action} ${shiftStep}`)}%`
            count++
        }, timeout)
    }

    const handlerControlButton = (controlButton, callback) => {
        controlButton.addEventListener('click', callback)
    }

    //вернет текущее значение позиции точки слайда
    const currentPositionDot = (controlDotAll) => {
        let currentPosition
        controlDotAll.forEach((el, ind) => {
            if (el.classList.contains('slider__control-dot_active')) {
                currentPosition = ind
            }
        })
        return currentPosition
    }

    //Функция для управление точкой слада
    //controlDotAll - панель управления слайдером
    //action - действие (+ вперед \ - назад)
    //shift - на сколько нужно сделать сдвиг
    const moveControlDot = (controlDotAll, isForwardDirection, shift = 1) => {
        const action = (isForwardDirection) ? '+' : '-'
        const currentIndexPositionDot = currentPositionDot(controlDotAll)
        let nextIndexPositionDot = eval(`${currentIndexPositionDot} ${action} ${shift}`);

        if (nextIndexPositionDot > (controlDotAll.length - 1)) {
            nextIndexPositionDot = 0
        }
        if (nextIndexPositionDot < 0) {
            nextIndexPositionDot = controlDotAll.length - 1
        }


        controlDotAll[currentIndexPositionDot].classList.remove('slider__control-dot_active')
        controlDotAll[nextIndexPositionDot].classList.add('slider__control-dot_active')
    }

    const initSlider = (slider, sliderWrapper, sliderBlockAll) => {
        sliderWrapper.style.width = `${sliderBlockAll.length * 100}%`
        sliderWrapper.style.left = `0%`
        widthSliderBlock(sliderBlockAll)
        createControlUI(slider, sliderBlockAll.length)
    }

    const slider = document.querySelector('.slider')
    const sliderWrapper = document.querySelector('.slider__wrapper')
    const sliderBlockAll = document.querySelectorAll('.slider__block')

    initSlider(slider, sliderWrapper, sliderBlockAll)

    const controlDotAll = document.querySelectorAll('.slider__control-dot')
    const controlPrev = document.querySelector('.slider__control-prev')
    const controlNext = document.querySelector('.slider__control-next')


    handlerControlButton(controlNext, () => {
        if (!interval) {//защита от уже активного перемещения

            //эмуляция выезжающего слайдера справа
            if (sliderWrapper.style.left === `-${(sliderBlockAll.length - 1) * 100}%` && currentPositionDot(controlDotAll) === 0) {
                sliderWrapper.insertAdjacentElement('afterbegin', sliderBlockAll[0])
                sliderWrapper.style.left = `0%`
            }

            if (sliderWrapper.style.left === `-${(sliderBlockAll.length - 1) * 100}%` && currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {

                sliderWrapper.insertAdjacentElement('afterbegin', sliderBlockAll[sliderBlockAll.length - 1])
                sliderWrapper.style.left = `0%`
            }
            if (sliderWrapper.style.left === '-100%' && currentPositionDot(controlDotAll) === 0) {

                sliderWrapper.style.left = `0%`
                sliderWrapper.insertAdjacentElement('beforeend', sliderBlockAll[sliderBlockAll.length - 1])
            }

            controlSlide(sliderWrapper, 1000, true)
            moveControlDot(controlDotAll, true)
        }
    })

    handlerControlButton(controlPrev, () => {
        if (!interval) {//защита от уже активного перемещения

            //эмуляция выезжающего сладйдера слева
            if (sliderWrapper.style.left === `0%` && currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {
                sliderWrapper.style.left = `-${(sliderBlockAll.length - 1) * 100}%`
                sliderWrapper.insertAdjacentElement('beforeend', sliderBlockAll[sliderBlockAll.length - 1])
            }
            if (sliderWrapper.style.left === `0%` && currentPositionDot(controlDotAll) === 0) {
                sliderWrapper.style.left = `-${(sliderBlockAll.length - 1) * 100}%`
                sliderWrapper.insertAdjacentElement('beforeend', sliderBlockAll[0])

            }
            if (sliderWrapper.style.left === `-${(sliderBlockAll.length - 2) * 100}%` && currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {
                sliderWrapper.style.left = `-${(sliderBlockAll.length - 1) * 100}%`
                sliderWrapper.insertAdjacentElement('afterbegin', sliderBlockAll[0])
            }

            controlSlide(sliderWrapper, 1000, false)
            moveControlDot(controlDotAll, false)
        }
    })

    //обработчик понели с точками
    controlDotAll.forEach((el, ind) => {
        el.addEventListener('click', () => {
            if (!interval) { //защита от уже активного перемещения

                const currentIndexPositionDot = currentPositionDot(controlDotAll)
                let shiftPosition = ind - currentIndexPositionDot
                const isForwardDirection = (shiftPosition > 0)
                shiftPosition = Math.abs(shiftPosition)

                if (shiftPosition) { //если клик на текущую позицию - то ничего не делаем

                    //эмуляция выезжающего сладйдера слева
                    if (sliderWrapper.style.left === '-100%' && currentPositionDot(controlDotAll) === 0) {
                        sliderWrapper.style.left = `0%`
                        sliderWrapper.insertAdjacentElement('beforeend', sliderBlockAll[sliderBlockAll.length - 1])
                    }
                    if (sliderWrapper.style.left === `-${(sliderBlockAll.length - 2) * 100}%` && currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {
                        sliderWrapper.style.left = `-${(sliderBlockAll.length - 1) * 100}%`
                        sliderWrapper.insertAdjacentElement('afterbegin', sliderBlockAll[0])
                    }
                    if (sliderWrapper.style.left === `-${(sliderBlockAll.length - 1) * 100}%` && currentPositionDot(controlDotAll) === 0) {
                        sliderWrapper.insertAdjacentElement('afterbegin', sliderBlockAll[0])
                        sliderWrapper.style.left = `0%`
                    }
                    if (sliderWrapper.style.left === `0%` && currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {
                        sliderWrapper.style.left = `-${(sliderBlockAll.length - 1) * 100}%`
                        sliderWrapper.insertAdjacentElement('beforeend', sliderBlockAll[sliderBlockAll.length - 1])
                    }


                    controlSlide(sliderWrapper, 1000, isForwardDirection, shiftPosition)
                    moveControlDot(controlDotAll, isForwardDirection, shiftPosition)
                }
            }

        })
    })


})