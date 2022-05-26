import { GithubUser } from "./GithubUser.js"

import (GithubUser)
// classe que vai conter toda a lógica dos dados (como os dados serão estruturados)

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load (){
        //Json = retorna sempre uma String, usa o parse para transformar em array
        this.entries = JSON.parse(localStorage.getItem('@github-Favorites:')) || []
    }

    save (){
        localStorage.setItem('@github-Favorites:', JSON.stringify(this.entries))
    }

    async add (username){
        try {

            const userExists = this.entries.find( entry => entry.login === username)
             if(userExists){
                throw new Error ('Usuário já cadastrado')
             }

            const user = await GithubUser.search(username)

            if (user.login === undefined){
                throw new Error ('Usuário não encontrado')
            }

            else {this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }}

        catch(error){
            alert(error.message)
        }
    }

    delete (user){
        // A função filter coloca no array o que for verdadeiro, e retira o que for falso
        const FilteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        // colocar o novo Array formado anteriormente no this.entries
        this.entries = FilteredEntries
        this.update()
        this.save()
    }
}
// classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites{
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
//console.log(this.root) - deverá aparecer a div app.
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const input = (this.root.querySelector('.search input'))
            // console.log(input.value)
            this.add(input.value)
        }
    }

    update(){
        this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    }

    createRow() {
        const tr = document.createElement('tr')
    
        const content = `
          <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
            <a href="https://github.com/maykbrito" target="_blank">
              <p>Mayk Brito</p>
              <span>maykbrito</span>
            </a>
          </td>
          <td class="repositories">
            76
          </td>
          <td class="followers">
            9589
          </td>
          <td>
            <button class="remove">&times;</button>
          </td>
        `
        tr.innerHTML = content
        return tr
      }

    removeAllTr(){
        
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }


}