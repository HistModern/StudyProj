window.addEventListener('DOMContentLoaded', ()=>{
    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items');
    function hideTabContent() {
        tabsContent.forEach( item => {
            item.style.display = "none"; 
        });

        tabs.forEach( item => {
            item.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(item = 0){
        tabsContent[item].style.display = "block";
        tabs[item].classList.add('tabheader__item_active');
    }


    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click' , (event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) => {
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }

    })

    //timer
    const deadline = '2025-04-11'
    
    function getZero(num){
        if (num >= 0 && num < 10){
            return `0${num}`;
        }
        else {
            return num
        }
    }
    function getTimeRemaining(endtime) {
        let days,hours,minutes,seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());
        if (t <= 0){
            days = 0;
              hours = 0;
              minutes = 0;
              seconds = 0;
        }
        else{
              days = Math.floor(t / (1000*60*60*24)),
              hours = Math.floor(t / (1000*60*60) % 24),
              minutes = Math.floor((t / 1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);
        }

                return {
                        'total' : t,
                        'days' : days,
                        'hours' : hours,
                        'minutes' : minutes,
                        'seconds' : seconds
                }

    }
   

    function setClock(selector , endtime) {
        const timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateclock, 1000);

        getTimeRemaining(deadline);
        updateclock();       

        function updateclock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
        }

       
    }

    setClock('.timer', deadline);

     //modal
        
    const modalTrigger = document.querySelectorAll('[data-modal]');
    const modal = document.querySelector('.modal');
    const modalCloseBtn = document.querySelector('[data-close]');
     
    function openModal(){
        modal.style.display = 'block'
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(el => {
        el.addEventListener('click', () => {
            openModal();
          });
    }
    )

    function closeModal(){
        modal.style.display = 'none'
        document.body.style.overflow = '';
    }
      modalCloseBtn.addEventListener('click', () =>{
        closeModal();
    });

    modal.addEventListener('click' , (e)=>{
       if (e.target === modal){
        closeModal();
       }
    })

     const modalTimerId = setTimeout(openModal , 6000)

    function windowByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', windowByScroll);
        }
    }
    
    window.addEventListener('scroll', windowByScroll)
    
    //use class for cards


    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 42;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }
    const getResource = async (url) => {
        const res =await fetch(url);

        if(!res.ok ){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
        };
    
        getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        });
      // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
    
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
        
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //Slider 

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current')
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesInner = document.querySelector('.offer__slider__inner'),
          wightblock = window.getComputedStyle(slidesWrapper).width;
    
    let slideIndex = 1;
    let offeset = 0;

    if ( slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }
    else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slides.forEach(slide => {
        slide.style.width = wightblock;
    } )

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carusel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;

    slider.append(indicators);


    for(let i = 0 ; i < slides.length; i++ ){
        const dot = document.createElement('li');
        dot.setAttribute('data-slite-to', i + 1);
        dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
        `;

        indicators.append(dot);
        dots.push(dot);
    }

    slidesInner.style.width = 100 * slides.length + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    function deleteNotDigits(str){
        return +str.replace(/\D/g, '')
    }

    next.addEventListener('click' , () =>{
        if(offeset == deleteNotDigits(wightblock) * (slides.length - 1) ){
            offeset = 0;
        }

        else{
            offeset += deleteNotDigits(wightblock);
        }

        slidesInner.style.transform = `translateX(-${offeset}px)`

        if (slideIndex == slides.length){
            slideIndex = 1;
        }
        else {
            slideIndex++
        }

        if ( slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }
        else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
        
    });

    prev.addEventListener('click' , () =>{
        if(offeset == 0){
            offeset += deleteNotDigits(wightblock) * (slides.length - 1) 
        }
    

        else{
            offeset -= deleteNotDigits(wightblock);
        }

        slidesInner.style.transform = `translateX(-${offeset}px)`

        if (slideIndex == 1){
            slideIndex = slides.length;
        }
        else {
            slideIndex--
        }

        if ( slides.length < 10){
            current.textContent = `0${slideIndex}`;
        }
        else {
            current.textContent = slideIndex;
        }
        
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slite-to');

            slideIndex = slideTo;
            offeset = deleteNotDigits(wightblock) * (slideTo - 1);

            slidesInner.style.transform = `translateX(-${offeset}px)`;

            if (slides.length < 10) {
                current.textContent =  `0${slideIndex}`;
            } else {
                current.textContent =  slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = ".5");
            dots[slideIndex - 1].style.opacity = 1;
        });
    });

    //calc

    const resultCalc = document.querySelector('.calculating__result span');
    let sex = 'female', height, weight, age , ratio = '1.375' ;

    function calcTotal(){
        if (!sex || !height || !weight || !age || !ratio){
            resultCalc.textContent = '____'
            return ;
        }

        if (sex === 'female '){
            resultCalc.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }
        else {
            resultCalc.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }

    }
    calcTotal();

    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                } else {
                    sex = e.target.getAttribute('id');
                }

    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch (input.getAttribute('id')){
                case 'height' :
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }
    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
});
