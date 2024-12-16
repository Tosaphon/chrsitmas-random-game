import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import './AdminPage.css';

const client = generateClient<Schema>();

export default function AdminPage() {
  const [numberEntries, setNumberEntries] = useState<{ id: string; number: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNumber, setNewNumber] = useState<string>(''); // State สำหรับหมายเลขใหม่

  // Fetch ข้อมูลหมายเลขทั้งหมด
  const fetchNumberEntries = async () => {
    setIsLoading(true);
    try {
      const response = await client.models.NumberEntry.list();
      setNumberEntries(response.data.sort((a, b) => parseInt(b.number) - parseInt(a.number)));
    } catch (error) {
      console.error('Error fetching numbers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNumberEntries();

    const sub = client.models.NumberEntry.observeQuery().subscribe({
      next: ({ items }) => {
        setNumberEntries(items.sort((a, b) => parseInt(b.number) - parseInt(a.number)));
      },
      error: (error) => {
        console.error('Error subscribing to data:', error);
      },
    });

    return () => sub.unsubscribe();
  }, []);

  // ฟังก์ชันเพิ่มหมายเลขใหม่
  const handleAddNumber = async () => {
    if (!newNumber || isNaN(Number(newNumber))) {
      alert('กรุณากรอกหมายเลขที่ถูกต้อง!');
      return;
    }

    const isDuplicate = numberEntries.some((entry) => entry.number === newNumber);
    if (isDuplicate) {
      alert('หมายเลขนี้มีอยู่ในระบบแล้ว!');
      return;
    }

    try {
      await client.models.NumberEntry.create({ number: newNumber });
      alert(`หมายเลข ${newNumber} ถูกเพิ่มเรียบร้อยแล้ว!`);
      setNewNumber(''); // รีเซ็ตค่า input
    } catch (error) {
      console.error('Error adding number:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหมายเลข กรุณาลองอีกครั้ง!');
    }
  };

  // ฟังก์ชันลบหมายเลข
  const handleRemove = async (id: string, number: string) => {
    const confirmDelete = window.confirm(`คุณต้องการลบหมายเลข ${number} จริงหรือไม่?`);
    if (!confirmDelete) return;

    try {
      await client.models.NumberEntry.delete({ id });
      alert(`หมายเลข ${number} ถูกลบเรียบร้อยแล้ว!`);
      fetchNumberEntries();
    } catch (error) {
      console.error('Error removing number:', error);
      alert('เกิดข้อผิดพลาดในการลบหมายเลข กรุณาลองอีกครั้ง!');
    }
  };

  // ฟังก์ชัน Clear Data ทั้งหมด
  const handleClearAll = async () => {
    const confirmClear = window.confirm('คุณต้องการรีเซ็ตทุกอย่างเป็นค่าเริ่มต้นหรือไม่?');
    if (!confirmClear) return;

    try {
      // อัปเดต RandomStatus ให้เป็น false
      const statusResponse = await client.models.RandomStatus.list();
      for (const status of statusResponse.data) {
        await client.models.RandomStatus.update({ id: status.id, status: false });
      }

      // ลบข้อมูลใน RandomNumber
      const randomNumberResponse = await client.models.RandomNumber.list();
      for (const record of randomNumberResponse.data) {
        await client.models.RandomNumber.delete({ id: record.id });
      }

      const numberResponse = await client.models.NumberEntry.list();
      for (const record of numberResponse.data) {
        await client.models.NumberEntry.delete({ id: record.id });
      }

      alert('ระบบถูกรีเซ็ตเป็นค่าเริ่มต้นเรียบร้อยแล้ว!');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('เกิดข้อผิดพลาดในการรีเซ็ตระบบ กรุณาลองอีกครั้ง!');
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-header">Admin Page</h1>

      {/* ส่วนเพิ่มหมายเลขใหม่ */}
      <div className="add-number-section">
        <input
          type="number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="Enter a new number"
          className="number-input"
        />
        <button onClick={handleAddNumber} className="btn btn-primary">
          Add Number
        </button>
      </div>

      {/* ตารางข้อมูล */}
      {isLoading ? (
        <p>Loading...</p>
      ) : numberEntries.length === 0 ? (
        <p>No numbers registered.</p>
      ) : (
        <table className="number-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {numberEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="number-cell">{entry.number}</td>
                <td className="action-cell">
                  <button
                    onClick={() => handleRemove(entry.id, entry.number)}
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ปุ่ม Clear All Data */}
      <div className="clear-data-section">
        <button className="btn btn-danger" onClick={handleClearAll}>
          Clear All Data
        </button>
      </div>
    </div>
  );
}