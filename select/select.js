const getTemplate =(data =[], placeholder, selectedId) =>{
    //const text = placeholder ?? 'implicitní placeholder'
    let text = placeholder ?? 'implicitní placeholder'

    const items = data.map(item =>{
        let cls=''
        if (item.id===selectedId){
            text=item.value
            cls='selected'
        }
        return `
        <li class="select__item ${cls}" data-type="item" data-id=${item.id}>${item.value}</li>
        `
    })

    return `
            <div class="select__input" data-type="input">
                <span data-type="value">
                   ${text} 
                </span>
                <i class="fas fa-chevron-down" data-type="arrow"></i>
       
            </div>
            <div class="select__dropdown">
                <ul class="select__list">
                   ${items.join('')}
                </ul>
            </div>
    `
}



export class Select{
    constructor(selector, options){
        this.$el = document.querySelector(selector)
        this.options = options
        //this.selectedId=null
        this.selectedId = options.selectedId

        this.#render()
        this.#setup()
    }

    #render(){        //privátní metoda
        const{placeholder, data} = this.options
        this.$el.classList.add('select')
        this.$el.innerHTML=getTemplate(data, placeholder, this.selectedId)
    }

    #setup(){
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click',this.clickHandler)
        //clickHandler voláme jako odkaz this.clickHandler
        //a proto se uvnitř funkce this ztrácí kontext
        //proto ji zabindujeme !! click handler
        // bude vždy přivázán ke kontextu thid třídy Select
        this.$arrow = this.$el.querySelector('[data-type="arrow"]')
        this.$value = this.$el.querySelector('[data-type="value"]')

        console.log('this.$value=',this.$value)
    }

    clickHandler(event){
        const {type } = event.target.dataset

        //console.log('type=',type)
        if(type==='input'||type==='arrow'){

            console.log('volám toggle')
            this.toggle()
        } else if (type === 'item'){
            const id = event.target.dataset.id
            this.select(id)
            //console.log('id=',id)
        }

        //console.log("event.target.dataset:",event.target.dataset)
        // console.log(type)
        // console.log('this.$arrow=',this.$arrow)
    }

    get current(){
        return this.options.data.find(item =>item.id === this.selectedId)
        //v currentu bude neustále náš vybraný prvek
    }

    select(id){
        this.selectedId = id
        this.$value.textContent=this.current.value
        //očistit předtím podbarvené položky
        this.$el.querySelectorAll('[data-type ="item"]').forEach(el =>{
            el.classList.remove('selected')
        })
        //obarvíme vybranou položku
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

        this.close()
    }

    get isOpen(){
        return this.$el.classList.contains('open')
    }

    toggle(){
        this.isOpen ? this.close() : this.open()
    }

    open(){
        this.$el.classList.add('open')
        this.$arrow.classList.remove('fa-chevron-down')
        this.$arrow.classList.add('fa-chevron-up')
    }

    close(){
        this.$el.classList.remove('open')
        this.$arrow.classList.remove('fa-chevron-up')
        this.$arrow.classList.add('fa-chevron-down')
    }

    destroy(){
        this.$el.removeEventListener('click',this.clickHandler)
        this.$el.innerHTML = ''
    }

}