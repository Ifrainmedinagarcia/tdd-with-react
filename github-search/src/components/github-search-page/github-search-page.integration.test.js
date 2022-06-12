import React from "react";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import GitHubSearchPage from "./GitHubSearchPage"
import { makeFakeRepo, makeFakeResponse, } from "../../__fixtures__/repos";
import { handlePaginated } from "../../__fixtures__/handlers";
import { OK_STATUS, } from "../../consts";

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


describe('When teh user clicks on search and then on next page button', () => {
    test('Must display the next repositories page', async () => {
        server.use(rest.get('/search/repositories', handlePaginated))

        fireClickSearch()    

        const table = await screen.findByRole('table')
        expect(table).toBeInTheDocument()

        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()

        expect(screen.getByRole("button", {name: /next page/i})).toBeEnabled()

        fireEvent.click(screen.getByRole("button", {name: /next page/i}))

        expect(screen.getByRole("button", {name: /search/iu})).toBeDisabled()
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})

        expect(screen.getByRole("cell", {name: /2-0/i})).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", {name: /previous page/i}))

        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})

        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()

    }, 10000);
});

describe('When the user does a search and clicks on next page button and selects 50 rows per page', () => {
    test('muste display the results of the first page', async () => {
        server.use(rest.get('/search/repositories', handlePaginated))

        fireClickSearch()    

        const table = await screen.findByRole('table')
        expect(table).toBeInTheDocument()

        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()

        expect(screen.getByRole("button", {name: /next page/i})).toBeEnabled()

        fireEvent.click(screen.getByRole("button", {name: /next page/i}))

        expect(screen.getByRole("button", {name: /search/iu})).toBeDisabled()
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})

        expect(screen.getByRole("cell", {name: /2-0/i})).toBeInTheDocument()

        fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
        fireEvent.click(screen.getByRole('option', {name: '50'}))
        await waitFor(()=> expect(screen.getByRole("button", {name: /search/i})).not.toBeDisabled(), {timeout: 3000})
        
        // expect first page
        expect(screen.getByRole("cell", {name: /1-0/i})).toBeInTheDocument()
    }, 10000);
});

describe('when the developer does a search and clicks on next page button and clicks on search again', () => {
    it('must display the results of the first page', async () => {
        server.use(rest.get('/search/repositories', handlePaginated))
  
        fireClickSearch()
    
        expect(await screen.findByRole('table')).toBeInTheDocument()
    
        expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
    
        expect(screen.getByRole('button', {name: /next page/i})).not.toBeDisabled()
    
        fireEvent.click(screen.getByRole('button', {name: /next page/i}))
    
        expect(screen.getByRole('button', {name: /search/i})).toBeDisabled()
    
        await waitFor(
            () =>
            expect(
                screen.getByRole('button', {name: /search/i}),
            ).not.toBeDisabled(),
            {timeout: 3000},
        )
    
        expect(screen.getByRole('cell', {name: /2-0/})).toBeInTheDocument()
    
        fireClickSearch()
    
        await waitFor(
            () =>
            expect(
                screen.getByRole('button', {name: /search/i}),
            ).not.toBeDisabled(),
            {timeout: 3000},
        )
    
        expect(screen.getByRole('cell', {name: /1-0/})).toBeInTheDocument()
        }, 10000)
  })
