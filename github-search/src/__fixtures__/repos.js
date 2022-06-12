
import repos30Paginated from './repos-30-paginated.json'
import repos50Paginated from './repos-50-paginated.json'

export const makeFakeResponse = ({totalCount = 0} = {}) => ({
    "total_count": totalCount,
    "items": []
})

export const makeFakeError = ({message = "Validation Failed"} = {}) => ({message})

export const makeFakeRepo = ( {name = 'qt5reactor', id = '33397954'} = {} ) => ({
    id,
    name,
    "owner":{"avatar_url": "https://avatars.githubusercontent.com/u/716546?v=4"},
    "html_url": "https://github.com/twisted/qt5reactor",
    "updated_at": "2022-04-11",
    "stargazers_count": 43,
    "forks_count": 18,
    "open_issues_count": 18,

})

const reposData = ['go', 'freeCodeCamp', 'laravel', 'Python', 'Java']

const reposList = reposData.map(name => makeFakeRepo({name, id: name}))

export const getReposList = ({name}) => reposList.filter(repo => repo.name === name)

export const getReposPerPage = ({currentPage, perPage}) => {
    return perPage === 30 ? repos30Paginated[currentPage] : repos50Paginated[currentPage]
}

export default {
    makeFakeResponse,
    makeFakeRepo,
    getReposList,
    getReposPerPage
}
