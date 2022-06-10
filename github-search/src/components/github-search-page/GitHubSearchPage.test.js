import React from "react";
import { screen, fireEvent, render, waitFor, within } from "@testing-library/react";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import GitHubSearchPage from "./GitHubSearchPage"
import { makeFakeRepo, makeFakeResponse, getReposList } from "../../__fixtures__/repos";
import { handlePaginated } from "../../__fixtures__/handlers";
import { OK_STATUS } from "../../consts";

const fakeResponse = makeFakeResponse({totalCount:1})

const fakeRepo = makeFakeRepo()

fakeResponse.items=[fakeRepo]

const server = setupServer(
    rest.get('/search/repositories', (_req, res, ctx) => {
      return res(
          ctx.status(OK_STATUS),
          ctx.json(fakeResponse)
        )
    }),
)

  
beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
 
beforeEach(()=> render(<GitHubSearchPage/>))

const fireClickSearch = () => {
    const btnSearch = screen.getByRole("button", {name: /search/i})
    fireEvent.click(btnSearch)
}

describe('When the GitHubSearchPage is mounted', () => {
    test('Must display the title', () => {
        expect(screen.getByRole("heading", {name: /Github repositories list/i})).toBeInTheDocument()
    });
    test('Must be an input text with label "filter by" field', () => {
      expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
    })
    test('Must be a Search Button ', () => {
        expect(screen.getByRole("button", {name: /search/i})).toBeInTheDocument()
    });
    test('must be a initial message “Please provide a search option and click in the search button”', () => {
        expect(screen.getByText(/Please provide a search option and click in the search button/i)).toBeInTheDocument()
    });
});

describe('When the user does a search', () => {
    test('The search button should be disabled until the search is done', async () => {
        const btnSearch = screen.getByRole("button", {name: /search/i})
        expect(btnSearch).toBeEnabled()

        fireEvent.change(screen.getByLabelText(/filter by/i), {target:{value: "test"}})

        expect(btnSearch).toBeEnabled()

        fireEvent.click(btnSearch)
        expect(btnSearch).toBeDisabled()
        await waitFor(()=> expect(btnSearch).toBeEnabled())
    });

    test('The data should be displayed as a sticke table', async () => {
        const btnSearch = screen.getByRole("button", {name: /search/i})
        const initialMessage = screen.queryByText(/Please provide a search option and click in the search button/i)
        fireEvent.click(btnSearch)
        
        await waitFor(()=> expect(initialMessage).not.toBeInTheDocument())
        expect(screen.getByRole("table")).toBeInTheDocument()
    });

    test('The header table should contain: Repository, stars, forks, open issues and updated at', async () => {
        fireClickSearch()
        const table = await screen.findByRole("table")
        const tableHeaders = within(table).getAllByRole("columnheader")
        const [Repository, Stars, Forks, OpenIssue, updatedAt] = tableHeaders
        
        expect(tableHeaders).toHaveLength(5)
        expect(Repository).toHaveTextContent(/Repository/i)
        expect(Stars).toHaveTextContent(/Stars/i)
        expect(Forks).toHaveTextContent(/Forks/i)
        expect(OpenIssue).toHaveTextContent(/Open Issues/i)
        expect(updatedAt).toHaveTextContent(/Updated at/i)
    });

    test('Each table result must countain: name, stars, updated at, forks, open issues. It should have a link that opens in a new tab the github repository selected', async () => {
        fireClickSearch()
        const table = await screen.findByRole("table")
        const withInTable = within(table)
        const tableCells = withInTable.getAllByRole("cell")
        const [Repository, Stars, Forks, OpenIssue, updatedAt] = tableCells
        const avatarImg = within(Repository).getByRole("img", {name: fakeRepo.name})

        expect(avatarImg).toBeInTheDocument()
        expect(tableCells).toHaveLength(5)
        expect(Repository).toHaveTextContent(fakeRepo.name)
        expect(Stars).toHaveTextContent(fakeRepo.stargazers_count)
        expect(Forks).toHaveTextContent(fakeRepo.forks_count)
        expect(OpenIssue).toHaveTextContent(fakeRepo.open_issues_count)
        expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)
        expect(withInTable.getByText(fakeRepo.name).closest("a")).toHaveAttribute("href", fakeRepo.html_url)
        expect(avatarImg).toHaveAttribute("src", fakeRepo.owner.avatar_url)
    });

    test('Must display total results number of the search and the current number of results.', async () => {
        fireClickSearch()
        await screen.findByRole("table")
        expect(screen.getByText(/1-1 of 1/i)).toBeInTheDocument()
    });

    test('A results size per page select/combobox with the options: 30, 50, 100. The default is 30.', async () => {
        fireClickSearch()
        await screen.findByRole("table")

        expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()
        fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
        const listbox = screen.getByRole("listbox", {name: /Rows per page/i})
        const options = within(listbox).getAllByRole("option")
        const [option30, option50, option100] = options

        expect(option30).toHaveTextContent(/30/)
        expect(option50).toHaveTextContent(/50/)
        expect(option100).toHaveTextContent(/100/)
    });

    test('Must exists the Next and previous pagination buttons', async () => {
        fireClickSearch()
        await screen.findByRole("table")
        const nextPageBtn = screen.getByRole("button", {name: /next page/i})
        const previousPageBtn = screen.getByRole("button", {name: /previous page/i})

        expect(previousPageBtn).toBeInTheDocument()
        expect(nextPageBtn).toBeInTheDocument()
        expect(previousPageBtn).toBeDisabled()
    });
});

describe('When the user does a search without results', () => {
    test('Must show a empty state message "You search has no result"', async () => {
            server.use(
                rest.get('/search/repositories', (_req, res, ctx) => {
                    return res(
                    ctx.status(OK_STATUS),
                    ctx.json(makeFakeResponse())
                  )
              }),
            )

        fireClickSearch()
        await waitFor(()=> expect(screen.getByText(/You search has no results/i)).toBeInTheDocument())
        expect(screen.queryByRole("table")).not.toBeInTheDocument()
    });
});

describe('When the user types on filter by and does a search', () => {
    test('Must display the related repos', async () => {
        const internalFakeResponse = makeFakeResponse()
        const REPO_NAME = "laravel"
        const expectedRepo = getReposList({name: REPO_NAME})[0]
        server.use(
            rest.get('/search/repositories', (req, res, ctx) => {
                return res(
                    ctx.status(OK_STATUS),
                    ctx.json({
                        ...internalFakeResponse, items: getReposList({name: req.url.searchParams.get('q')})
                    })
                )
            }),
        )
        fireEvent.change(screen.getByLabelText(/filter by/i), { target: { value: "laravel" } } )
        fireClickSearch()
        const table = await screen.findByRole('table')

        expect(table).toBeInTheDocument()
        const withInTable = within(table)
        const tableCells = withInTable.getAllByRole("cell")
        const [Repository] = tableCells

        expect(tableCells).toHaveLength(5)
        expect(Repository).toHaveTextContent(expectedRepo.name)
    });
});

describe('When the user does a search and selectes 50 rows per page', () => {
    test('Must fetch a new search and display 50 rows results on the table', async () => {
        server.use(
            rest.get('/search/repositories', handlePaginated),
        )
        fireClickSearch()
        const table = await screen.findByRole('table')
        expect(table).toBeInTheDocument()
        expect(await screen.findAllByRole('row')).toHaveLength(31)

        fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
        fireEvent.click(screen.getByRole('option', {name: '50'}))
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})
        expect(await screen.findAllByRole('row')).toHaveLength(51)
    });
});

describe('When teh user clicks on search and then on next page button', () => {
    test('Must display the next repositories page', async () => {
           server.use(
            rest.get('/search/repositories', handlePaginated),
        )

        fireClickSearch()    

        const table = await screen.findByRole('table')
        expect(table).toBeInTheDocument()

        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()

        expect(screen.getByRole("button", {name: /next page/i})).toBeEnabled()

        fireEvent.click(screen.getByRole("button", {name: /next page/i}))

        expect(screen.getByRole("button", {name: /search/iu})).toBeDisabled()
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})

        expect(screen.getByRole("cell", {name: /2-0/i})).toBeInTheDocument()

        // click previous page
        fireEvent.click(screen.getByRole("button", {name: /previous page/i}))

        
        // wait search finish
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})

        // expect
        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()


    }, 10000);
});