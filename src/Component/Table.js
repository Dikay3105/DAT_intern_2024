import React, { useState } from 'react';
import './Table.scss';

const Table = () => {
    // Dữ liệu lấy từ mảng
    const [data, setData] = useState([
        { id: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [typeShow, setTypeShow] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');

    const handleDoubleClick = (rowIndex, field, value) => {
        setEditingCell({ rowIndex, field });
        setNewValue(value);
    };

    const addData = () => {
        const newRow = { id: data.length + 1, name: '', age: '', country: '' };
        setData([...data, newRow]);
    };

    const handleChange = (e) => {
        setNewValue(e.target.value);
    };

    const handleBlur = () => {
        if (editingCell.rowIndex !== null && editingCell.field) {
            const updatedData = [...data];
            updatedData[editingCell.rowIndex][editingCell.field] = newValue;
            setData(updatedData);
            setEditingCell({ rowIndex: null, field: null });
            setNewValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    return (
        <div className="table">
            <div className={`table_container ${typeShow ? 'vertical' : ''}`}>
                <div className={`table_container_header ${typeShow ? 'vertical' : ''}`}>
                    <div className="table_container_header_cell">NO.</div>
                    <div className="table_container_header_cell">Name</div>
                    <div className="table_container_header_cell">Age</div>
                    <div className="table_container_header_cell">Country</div>
                </div>
                {data.map((person, index) => (
                    <div className={`table_container_row ${typeShow ? 'vertical' : ''}`} key={index}>
                        <div className="table_container_row_cell">{index + 1}</div>
                        <div
                            className="table_container_row_cell"
                            onDoubleClick={() => handleDoubleClick(index, 'name', person.name)}
                        >
                            {editingCell.rowIndex === index && editingCell.field === 'name' ? (
                                <input
                                    value={newValue}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                            ) : (
                                person.name
                            )}
                        </div>
                        <div
                            className="table_container_row_cell"
                            onDoubleClick={() => handleDoubleClick(index, 'age', person.age)}
                        >
                            {editingCell.rowIndex === index && editingCell.field === 'age' ? (
                                <input
                                    value={newValue}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                            ) : (
                                person.age
                            )}
                        </div>
                        <div
                            className="table_container_row_cell"
                            onDoubleClick={() => handleDoubleClick(index, 'country', person.country)}
                        >
                            {editingCell.rowIndex === index && editingCell.field === 'country' ? (
                                <input
                                    value={newValue}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    style={{ height: '100%', width: '100%' }}
                                />
                            ) : (
                                person.country
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setTypeShow(!typeShow)}>Change</button>
            <button onClick={addData}>Add {typeShow ? 'column' : 'row'}</button>
        </div>
    );
};

export default Table;
