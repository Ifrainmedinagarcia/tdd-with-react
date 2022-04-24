import React from "react";
import { screen, fireEvent, render, waitFor, within } from "@testing-library/react";
import GitHubSearchPage from "./GitHubSearchPage";

beforeEach(()=> render(<GitHubSearchPage/>))

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
        const btnSearch = screen.getByRole("button", {name: /search/i})
        fireEvent.click(btnSearch)
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
        const btnSearch = screen.getByRole("button", {name: /search/i})
        fireEvent.click(btnSearch)
        const table = await screen.findByRole("table")
        const withInTable = within(table)
        const tableCells = withInTable.getAllByRole("cell")
        const [Repository, Stars, Forks, OpenIssue, updatedAt] = tableCells

        expect(within(Repository).getByRole("img", {name: /test/i})).toBeInTheDocument()
        expect(tableCells).toHaveLength(5)
        expect(Repository).toHaveTextContent(/Test/i)
        expect(Stars).toHaveTextContent(/10/)
        expect(Forks).toHaveTextContent(/5/)
        expect(OpenIssue).toHaveTextContent(/2/)
        expect(updatedAt).toHaveTextContent(/2020-01-01/)
        expect(withInTable.getByText(/test/i).closest("a")).toHaveAttribute("href", "https://localhost:3000/test")
    });

    test('Must display total results number of the search and the current number of results.', async () => {
        const btnSearch = screen.getByRole("button", {name: /search/i})
        fireEvent.click(btnSearch)
        await screen.findByRole("table")
        expect(screen.getByText(/1-1 of 1/i)).toBeInTheDocument()
    });

    test('A results size per page select/combobox with the options: 30, 50, 100. The default is 30.', async () => {
        const btnSearch = screen.getByRole("button", {name: /search/i})
        fireEvent.click(btnSearch)
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
        const btnSearch = screen.getByRole("button", {name: /search/i})
        fireEvent.click(btnSearch)
        await screen.findByRole("table")
        const nextPageBtn = screen.getByRole("button", {name: /next page/i})
        const previousPageBtn = screen.getByRole("button", {name: /previous page/i})

        expect(previousPageBtn).toBeInTheDocument()
        expect(nextPageBtn).toBeInTheDocument()
        expect(previousPageBtn).toBeDisabled()
    });
});

describe('When the user does a search without results', () => {
    test('Must show a empty state message', () => {
        
    });
});