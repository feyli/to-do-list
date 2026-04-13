import { FunctionComponent, useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import './Footer.css';

interface FooterProps {
    onOpenModal: (type: 'task' | 'subset') => void;
}

const Footer: FunctionComponent<FooterProps> = ({onOpenModal}) => {
    const [showOptions, setShowOptions] = useState(false);

    const handleOption = (type: 'task' | 'subset') => {
        setShowOptions(false);
        onOpenModal(type);
    };

    return (
        <div className="footer">
            {showOptions && (
                <div className="fab-options">
                    <button className="fab-option" onClick={() => handleOption('task')}>
                        New Task
                    </button>
                    <button className="fab-option" onClick={() => handleOption('subset')}>
                        New Subset
                    </button>
                </div>
            )}
            <button
                className="fab-button"
                onClick={() => setShowOptions(!showOptions)}
            >
                {showOptions ? <MdClose/> : <MdAdd/>}
            </button>
        </div>
    );
};

export default Footer;
