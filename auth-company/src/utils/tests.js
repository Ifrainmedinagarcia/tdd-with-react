import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";

export const renderWithRouter = (ui, {route = "/"}= {}) => {
    window.history.pushState({}, "", route)
    return render(ui, {wrapper: Router})
}

export default {renderWithRouter}