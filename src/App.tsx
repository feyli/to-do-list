import { FunctionComponent } from 'react';
import './App.css';
import { MdChecklist } from "react-icons/md";

const App: FunctionComponent = () => {
    return (
        <>
            <header className={"app-header"}>
                <MdChecklist className={"header-icon"} />
                To-Do List
            </header>
        </>
    );
};

export default App;
