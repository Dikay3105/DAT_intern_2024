import React, { useState } from 'react';
import './Table.scss';
import { IoMdClose } from 'react-icons/io';

const Table = () => {
    const [data, setData] = useState([
        { id: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [typeShow, setTypeShow] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [addCount, setAddCount] = useState(1);
    const [columns, setColumns] = useState(["NO.", "Name", "Age", "Country"]);
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
    const [newColumnName, setNewColumnName] = useState('');
    const [columnWidths, setColumnWidths] = useState(columns.map(() => '200px')); // Kích thước mặc định
    const [selectedColumnForWidth, setSelectedColumnForWidth] = useState(null);
    const [newColumnWidth, setNewColumnWidth] = useState('200');
    const [columnToDelete, setColumnToDelete] = useState(null); // Cột muốn xóa

    const handleDoubleClick = (rowIndex, field, value) => {
        setEditingCell({ rowIndex, field });
        setNewValue(value);
    };

    const addColumn = () => {
        if (!newColumn.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        if (columns.map(column => column.toLowerCase()).includes(newColumn.toLowerCase())) {
            alert("Column already exists.");
            return;
        }

        setColumns([...columns, newColumn]);
        setColumnWidths([...columnWidths, '200px']); // Thêm kích thước mặc định cho cột mới

        const updatedData = data.map(row => ({
            ...row,
            [newColumn.toLowerCase()]: '',
        }));
        setData(updatedData);
        setNewColumn('');
        setIsPopupOpen(false);
    };

    const addRowData = () => {
        const newRows = Array.from({ length: addCount }, (_, i) => ({
            id: data.length + i + 1,
            name: '',
            age: '',
            country: '',
        }));

        if (data.length + newRows.length > 10) {
            alert("Cannot add more than 10 items.");
            return;
        }

        setData([...data, ...newRows]);
        setAddCount(1);
        setIsPopupOpen(false);
    };

    const deleteData = (index) => {
        if (data.length <= 1) {
            alert("Cannot delete the last remaining item.");
            return;
        }

        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
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

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const updateColumnName = (index) => {
        if (!newColumnName.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        const oldColumnName = columns[index];
        const updatedColumns = [...columns];
        updatedColumns[index] = newColumnName;
        setColumns(updatedColumns);

        const updatedData = data.map(row => {
            row[newColumnName.toLowerCase()] = row[oldColumnName.toLowerCase()];
            delete row[oldColumnName.toLowerCase()];
            return row;
        });

        setData(updatedData);
        setNewColumnName('');
        setSelectedColumnIndex(null);
    };

    const updateColumnWidth = (index, width) => {
        const updatedWidths = [...columnWidths];
        updatedWidths[index] = `${width}px`;
        setColumnWidths(updatedWidths);
        setSelectedColumnForWidth(null);
        setNewColumnWidth('200');
    };

    const deleteColumn = () => {
        if (columns[columnToDelete] === "NO.") {
            alert("Cannot delete the NO. column.");
            return;
        }

        if (columnToDelete !== null) {
            const updatedColumns = columns.filter((_, index) => index !== columnToDelete);
            setColumns(updatedColumns);

            const updatedData = data.map(row => {
                const updatedRow = { ...row };
                delete updatedRow[columns[columnToDelete].toLowerCase()];
                return updatedRow;
            });

            setData(updatedData);
            setColumnToDelete(null);
            setIsPopupOpen(false);
        }
    };

    return (
        <div className="table">
            <div className="table_gear" onClick={togglePopup}>⚙️</div>
            <div className={`table_container ${typeShow ? 'vertical' : ''}`}>
                <div className={`table_container_header ${typeShow ? 'vertical' : ''}`}>
                    {columns.map((value, key) => (
                        <div className="table_container_header_cell" key={key} style={{ width: columnWidths[key] }}>{value}</div>
                    ))}
                    <div className="table_container_header_cell" style={{ width: '50px' }}>Actions</div>
                </div>
                {data.map((person, index) => (
                    <div className={`table_container_row ${typeShow ? 'vertical' : ''}`} key={index}>
                        <div className="table_container_row_cell" style={{ width: columnWidths[0] }}>{index + 1}</div>

                        {columns.slice(1).map((column, colIndex) => (
                            <div
                                className="table_container_row_cell"
                                style={{ width: columnWidths[colIndex + 1] }}
                                onDoubleClick={() => handleDoubleClick(index, column.toLowerCase(), person[column.toLowerCase()] || '')}
                                key={colIndex}
                            >
                                {editingCell.rowIndex === index && editingCell.field === column.toLowerCase() ? (
                                    <input
                                        value={newValue}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        autoFocus
                                    />
                                ) : (
                                    person[column.toLowerCase()] || ''
                                )}
                            </div>
                        ))}
                        <div className="table_container_row_cell">
                            <button onClick={() => deleteData(index)} style={{ width: '50px' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isPopupOpen && (
                <>
                    <div className="table_overlay" onClick={togglePopup}></div>
                    <div className="table_popup">
                        <div className="table_popup_title">
                            <h3>Edit</h3>
                            <div onClick={() => setIsPopupOpen(false)} style={{ cursor: "pointer" }}>
                                <IoMdClose />
                            </div>
                        </div>

                        <button className="table_popup_change" onClick={() => setTypeShow(!typeShow)}>Change</button>

                        <label>
                            Number of rows to add:
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={addCount}
                                onChange={(e) => setAddCount(Number(e.target.value))}
                            />
                        </label>
                        <button className="table_popup_add" onClick={addRowData}>Add {typeShow ? 'column' : 'row'}</button>

                        <label>
                            New column name:
                            <input
                                type="text"
                                value={newColumn}
                                onChange={(e) => setNewColumn(e.target.value)}
                            />
                        </label>
                        <button className="table_popup_add" onClick={addColumn}>Add {typeShow ? 'row' : 'column'}</button>

                        <div>
                            Chọn cột đổi tên
                            <select
                                value={selectedColumnIndex}
                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                            >
                                <option value={null}>-- Chọn cột --</option>
                                {columns.map((col, index) => (
                                    <option key={index} value={index}>{col}</option>
                                ))}
                            </select>
                        </div>
                        {selectedColumnIndex !== null && (
                            <>
                                <div>
                                    New name for {columns[selectedColumnIndex]}:
                                    <input
                                        type="text"
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                    />
                                </div>
                                <button className="table_popup_update" onClick={() => updateColumnName(selectedColumnIndex)}>Update Column Name</button>
                            </>
                        )}

                        <div>
                            Chọn cột để chỉnh kích thước
                            <select
                                value={selectedColumnForWidth}
                                onChange={(e) => setSelectedColumnForWidth(Number(e.target.value))}
                            >
                                <option value={null}>-- Chọn cột --</option>
                                {columns.map((col, index) => (
                                    <option key={index} value={index}>{col}</option>
                                ))}
                            </select>
                        </div>
                        {selectedColumnForWidth !== null && (
                            <>
                                <div>
                                    Width for {columns[selectedColumnForWidth]}:
                                    <input
                                        type="number"
                                        value={newColumnWidth}
                                        onChange={(e) => setNewColumnWidth(e.target.value)}
                                    />
                                    px
                                </div>
                                <button onClick={() => updateColumnWidth(selectedColumnForWidth, newColumnWidth)}>Update Column Width</button>
                            </>
                        )}
                        <div>
                            Chọn cột để xóa
                            <select
                                value={columnToDelete}
                                onChange={(e) => setColumnToDelete(Number(e.target.value))}
                            >
                                <option value={null}>-- Chọn cột --</option>
                                {columns.map((col, index) => (
                                    <option key={index} value={index}>{col}</option>
                                ))}
                            </select>
                        </div>
                        {columnToDelete !== null && (
                            <button onClick={deleteColumn}>Delete Column</button>
                        )}

                    </div>
                </>
            )}
        </div>
    );
};

export default Table;
