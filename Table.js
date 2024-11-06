import React, { useState } from 'react';
import './Table.scss';
import { IoMdClose } from 'react-icons/io';

const Table = () => {
    const [data, setData] = useState([
        { id: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [columns, setColumns] = useState(["NO.", "Name", "Age", "Country"]);
    const [typeShow, setTypeShow] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [addCount, setAddCount] = useState(1); // Số lượng hàng muốn thêm
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(null); // Chỉ số cột 
    const [newColumnName, setNewColumnName] = useState(''); // Tên mới cho cột


    const handleDoubleClick = (rowIndex, field, value) => {
        setEditingCell({ rowIndex, field });
        setNewValue(value);
    };

    const addColumn = () => {
        if (!newColumn.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        // Kiểm tra xem tên cột có trùng không
        if (columns.map(column => column.toLowerCase()).includes(newColumn.toLowerCase())) {
            alert("Column already exists.");
            return;
        }

        setColumns([...columns, newColumn]);

        // Cập nhật mỗi hàng trong data để thêm cột mới với giá trị rỗng
        const updatedData = data.map(row => ({
            ...row,
            [newColumn.toLowerCase()]: '', // Thêm cột mới với giá trị rỗng
        }));
        setData(updatedData);
        setNewColumn('');
        setIsPopupOpen(false);
    };


    const addRowData = () => {
        const newRows = Array.from({ length: addCount }, (_, i) => ({
            id: data.length + i + 1, //Sử dụng nếu id là person.id, còn id = key thì dòng này có thể có hoặc không.
            name: '',
            age: '',
            country: '',
        }));

        if (data.length + newRows.length > 10) {
            alert("Cannot add more than 10 items.");
            return;
        }

        setData([...data, ...newRows]);
        setAddCount(1); // Reset số lượng thêm sau khi hoàn tất
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
        //trim() xóa khoản trống đầu và đuôi của chuỗi nhập
        if (!newColumnName.trim()) {
            alert("Column name cannot be empty.");
            return;
        }
    
        const oldColumnName = columns[index];
        const updatedColumns = [...columns];
        updatedColumns[index] = newColumnName;
        setColumns(updatedColumns);
    
        // Cập nhật dữ liệu cho tất cả các hàng trong `data`
        const updatedData = data.map(row => {
            // Di chuyển dữ liệu từ cột cũ sang cột mới
            row[newColumnName.toLowerCase()] = row[oldColumnName.toLowerCase()];
            delete row[oldColumnName.toLowerCase()]; // Xóa cột cũ
            return row;
        });
    
        setData(updatedData);
        setNewColumnName(''); 
        setSelectedColumnIndex(null); 
    };
    
    return (
        <div className="table">
            <div className="table_gear" onClick={togglePopup}>⚙️</div>
            <div className={`table_container ${typeShow ? 'vertical' : ''}`}>
                <div className={`table_container_header ${typeShow ? 'vertical' : ''}`}>
                    {columns.map((value, key) => (
                        <div className="table_container_header_cell" key={key}>{value}</div>
                    ))}
                    <div className="table_container_header_cell">Actions</div>
                </div>
                {data.map((person, index) => (
                    <div className={`table_container_row ${typeShow ? 'vertical' : ''}`} key={index}>
                        <div className="table_container_row_cell">{index + 1}</div>

                        {/* lập từ cột 2 giữ nguyên cột 1 */}
                        {columns.slice(1).map((column, colIndex) => (
                            <div
                                className="table_container_row_cell"
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
                            <button onClick={() => deleteData(index)}>Delete</button>
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

                        {/* Thay đổi kiểu hiển thị */}
                        <button className="table_popup_change" onClick={() => setTypeShow(!typeShow)}>Change</button>

                        {/* Số lượng hàng muốn thêm */}
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

                        {/* Thêm cột mới */}
                        <label>
                            New column name:
                            <input
                                type="text"
                                value={newColumn}
                                onChange={(e) => setNewColumn(e.target.value)}
                            />
                        </label>
                        <div className="table_popup_togle">
                            <button className="table_popup_add" onClick={addColumn}>Add {typeShow ? 'row' : 'column'}</button>
                        </div>

                        {/* Chỉnh sửa tên cột */}
                        <div>
                            chọn cột đổi tên
                            <select
                                value={selectedColumnIndex}
                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                            >
                                <option value={null}>-- chọn cột --</option>
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

                        <button className="table_popup_close" onClick={togglePopup}>Close</button>
                    </div>
                </>
            )}


        </div>
    );
};

export default Table;
