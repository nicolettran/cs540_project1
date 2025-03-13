import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
    const [numProcesses, setNumProcesses] = useState(5);
    const [timeQuantum, setTimeQuantum] = useState(5);
    const [selectedAlgorithms, setSelectedAlgorithms] = useState({
        fifo: false,
        sjf: false,
        stcf: false,
        rr: false,
        mlfq: false,
    });

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedAlgorithms((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(numProcesses, timeQuantum, selectedAlgorithms);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Number of Processes:</label>
                <input
                    type="number"
                    value={numProcesses}
                    onChange={(e) => setNumProcesses(e.target.value)}
                />
            </div>
            <div>
                <label>Time Quantum:</label>
                <input
                    type="number"
                    value={timeQuantum}
                    onChange={(e) => setTimeQuantum(e.target.value)}
                />
            </div>
            <div>
                <label>Choose Algorithms:</label>
                <div>
                    <input
                        type="checkbox"
                        name="fifo"
                        checked={selectedAlgorithms.fifo}
                        onChange={handleCheckboxChange}
                    />
                    FIFO
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="sjf"
                        checked={selectedAlgorithms.sjf}
                        onChange={handleCheckboxChange}
                    />
                    SJF
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="stcf"
                        checked={selectedAlgorithms.stcf}
                        onChange={handleCheckboxChange}
                    />
                    STCF
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="rr"
                        checked={selectedAlgorithms.rr}
                        onChange={handleCheckboxChange}
                    />
                    RR
                </div>
                <div>
                    <input
                        type="checkbox"
                        name="mlfq"
                        checked={selectedAlgorithms.mlfq}
                        onChange={handleCheckboxChange}
                    />
                    MLFQ
                </div>
            </div>
            <button type="submit">Run Simulation</button>
        </form>
    );
};

export default InputForm;

