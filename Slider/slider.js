window.addEventListener('DOMContentLoaded', () => {

    //Устанавливаем ширину блока с изображениями - зависит от числа img
    const widthSliderBlock = (sliderBlockAll) => {
        sliderBlockAll.forEach(el => {
            el.style.width = `${100 / (sliderBlockAll.length + 2)}%` //компенсируем слайдерами спереди и сзади
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


        for(let i = 0; i < countImg; i++) {

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
    const controlSlide = (sliderWrapper, timer, action, shift = 1) => {
        let count = 1
        let timeout = 5
        let countTarget = (timer / timeout)
        let shiftStep = (shift * 100) / countTarget
        action = (action === '+') ? '-' : '+'
        interval = setInterval(() => {
            if (count === countTarget) {
                clearInterval(interval)
                interval = null
            }
            const currentStyleLeft = Number(sliderWrapper.style.left.replace('%',''))
            sliderWrapper.style.left = `${eval(`${currentStyleLeft} ${action} ${shiftStep}`)}%`
            count++
        }, timeout)
    }

    const handlerControlButton = (controlButton, callback ) => {
        controlButton.addEventListener('click', callback)
    }

    //вернет текущее значение позиции точки слайда
    const currentPositionDot = (controlDotAll) => {
        let currentPosition
        controlDotAll.forEach( (el, ind) => {
            if(el.classList.contains('slider__control-dot_active')) {
                currentPosition = ind
            }
        })
        return currentPosition
    }

    //Функция для управление точкой слада
    //controlDotAll - панель управления слайдером
    //action - действие (+ вперед \ - назад)
    //shift - на сколько нужно сделать сдвиг
    const moveControlDot = (controlDotAll, action, shift = 1) => {
        let currentIndexPositionDot = currentPositionDot(controlDotAll)
        let nextIndexPositionDot = eval(`${currentIndexPositionDot} ${action} ${shift}`);

        if(nextIndexPositionDot > (controlDotAll.length - 1) ) {
            nextIndexPositionDot = 0
        }
        if(nextIndexPositionDot < 0) {
            nextIndexPositionDot = controlDotAll.length - 1
        }


        controlDotAll[currentIndexPositionDot].classList.remove('slider__control-dot_active')
        controlDotAll[nextIndexPositionDot].classList.add('slider__control-dot_active')
    }

    const slider = document.querySelector('.slider')
    const sliderWrapper = document.querySelector('.slider__wrapper')
    const sliderBlockAll = document.querySelectorAll('.slider__block')

    sliderWrapper.style.width = `${(sliderBlockAll.length + 2) * 100}%` //компенсируем слайдерами спереди и сзади
    sliderWrapper.style.left = `0%`
    widthSliderBlock(sliderBlockAll)
    createControlUI(slider, sliderBlockAll.length)

    const controlDotAll = document.querySelectorAll('.slider__control-dot')
    const controlPrev = document.querySelector('.slider__control-prev')
    const controlNext = document.querySelector('.slider__control-next')


    handlerControlButton(controlNext, () => {
        if(!interval) {
            controlSlide(sliderWrapper, 1000, '+')
            moveControlDot(controlDotAll, '+')

            //console.log(currentPositionDot(controlDotAll))
            // if(currentPositionDot(controlDotAll) === (sliderBlockAll.length - 1)) {
            //     console.log(sliderBlockAll[0])
            //     let cloneFirstBlock = sliderBlockAll[0].cloneNode(true)
            //
            //     sliderWrapper.appendChild(cloneFirstBlock)
            //     //widthSliderBlock(sliderBlockAll)
            //     console.log(sliderWrapper)
            //
            //
            // }

        }
    })

    handlerControlButton(controlPrev, () => {
        if(!interval) {
            controlSlide(sliderWrapper, 1000, '-')
            moveControlDot(controlDotAll, '-')
        }
    })

    controlDotAll.forEach((el, ind) => {
        el.addEventListener('click', () => {

            if(!interval) {
                const currentIndexPositionDot = currentPositionDot(controlDotAll)
                let shiftPosition = ind - currentIndexPositionDot
                const action = (shiftPosition > 0) ? '+' : '-'
                shiftPosition = Math.abs(shiftPosition)

                controlSlide(sliderWrapper, 1000, action, shiftPosition)
                moveControlDot(controlDotAll, action, shiftPosition)
            }

        })
    })


        })