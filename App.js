const $main = document.getElementById('main'),
$templateCard = document.getElementById('templateCard').content,
$searchBox = document.getElementById('search-box'),
alive = 'bg-lime-500',
dead = 'bg-red-500',
unkown = 'bg-slate-500'

// Variables de apoyo

let next,
lastchild,
$fragment = document.createDocumentFragment()

const getStatus = (statusCharacter)=>{
    
    const status = {
        alive,
        dead,
        default:unkown
    }

    return status[statusCharacter.toLowerCase()]||unkown
    
}


const observer = new IntersectionObserver((entries)=>(entries[0].isIntersecting)&&getCharacter(next),{
    threshold:.3
})


const getCharacter = async (URL)=>{


    try{
        if(URL === null || !URL ) return 
        let res = await fetch (URL)


        if(!res.ok) throw new Error('Ocurrio un error')

        let data = await res.json(),
        {info,results} = data

        next = info.next

        for(let character of results){


            const {name,status,species,image,location:{name:nameLocation},episode} = character

                const resEpisode = await fetch(episode[0]),
                dataEpisode = await resEpisode.json(),
                {name:nameEpisode} = dataEpisode
            
                $templateCard.querySelector('img').src = image;
                $templateCard.querySelector('img').alt = name;
                $templateCard.querySelector('img').loading = 'lazy';
                $templateCard.getElementById('name').textContent = name;
                $templateCard.getElementById('status').textContent = `${status} - ${species}`
                $templateCard.getElementById('location').textContent = nameLocation
                $templateCard.getElementById('first_episode').textContent = nameEpisode
                $templateCard.getElementById('mark_status').classList.remove(alive,dead,unkown)
                $templateCard.getElementById('mark_status').classList.add(getStatus(status))
                
                let $clone = document.importNode($templateCard,true)

                $fragment.append($clone)
                

        }
        
        $main.append($fragment)


        if(lastchild){
            observer.unobserve(lastchild)
        }

        lastchild = $main.lastElementChild

     
        observer.observe(lastchild)
   }
   catch{
       console.warn('Ocurrio un error')
       $main.innerHTML=`

        <div class='container mx-auto flex justify-center col-span-2 flex-col items-center text-letter text-2xl font-medium'>
            <img src='assets/RickAndMorty.png' class='h-40'/>
            <p>Sorry no results!</p>
        </div>

       `
   }
    
}


document.addEventListener('DOMContentLoaded',getCharacter('https://rickandmortyapi.com/api/character'))


$searchBox.addEventListener('keyup',function(e){
   if(e.key === 'Enter'){
    $main.innerHTML = '';
    this.blur()
    getCharacter(`https://rickandmortyapi.com/api/character/?name=${this.value}`)
   }
   if(e.key === 'Escape'){
    this.value = ''
    $main.innerHTML = '';
    getCharacter('https://rickandmortyapi.com/api/character')
   } 
})


/* 

→Falta colocar validaciones en caso de una respuesta b¿negativa del servidor 
→Usar Bloques try catchpara la captura de errores

//Si hacemos una peticion dentro de otra peticion, no hace falta volver a colocar async o crear una funcion asincrona nueva ya que podemos usar await sin ningun problema ya que la funcion padre es asincrona 


*/
  