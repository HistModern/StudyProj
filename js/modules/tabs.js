function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass ){
    // tabs
    const tabs = document.querySelectorAll(tabsSelector),
      tabsContent = document.querySelectorAll(tabsContentSelector),
      tabsParent = document.querySelector(tabsParentSelector);
    function hideTabContent() {
        tabsContent.forEach( item => {
            item.style.display = "none"; 
        });

        tabs.forEach( item => {
            item.classList.remove(activeClass)
        })
    }

    function showTabContent(item = 0){
        tabsContent[item].style.display = "block";
        tabs[item].classList.add(activeClass);
    }


    hideTabContent();
    showTabContent(0);

    tabsParent.addEventListener('click' , (event) =>{
        const target = event.target;

        if(target && target.classList.contains(tabsSelector.slice(1))){
            tabs.forEach((item, i) => {
                if (target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }

    })
}

export default tabs;