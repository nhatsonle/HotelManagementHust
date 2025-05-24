import React, { useEffect, useState } from 'react';
import { getDeals, addDeal, updateDeal, deleteDeal, getRoomTypes } from '../services/api';
import EditDeal from './EditDeal';
import ellipsisVertical from '../assets/ellipsis-vertical.svg';

const RateTable = () => {
  const [deals, setDeals] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      const [dealsRes, roomTypesRes] = await Promise.all([getDeals(), getRoomTypes()]);
      const mappedDeals = dealsRes.data.data.map(d => ({
        ...d,
        id: d.rate_id
      }));
      setDeals(mappedDeals);
      setRoomTypes(roomTypesRes.data.data);
    } catch (err) {
      console.error("Failed to fetch deals or room types", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (data) => {
    try {
      const payload = {
        deal_name: data.deal_name,
        type_id: Number(data.type_id),
        discount: parseFloat(data.discount).toFixed(2),
        deal_price: parseFloat(data.deal_price).toFixed(2),
        availability: Number(data.availability),
        start_date: data.start_date,
        end_date: data.end_date,
        cancellation_policy: data.cancellation_policy
      };

      if (isAdding) {
        await addDeal(payload);
      } else if (data.id) {
        await updateDeal(data.id, payload);
      } else {
        console.error("Missing deal id for update.");
        return;
      }

      await fetchData();
      setSelectedDeal(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDeal(id);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Sort deals by room type name
  const sortedDeals = [...deals].sort((a, b) => {
    const nameA = roomTypes.find(rt => rt.type_id === a.type_id)?.type_name || '';
    const nameB = roomTypes.find(rt => rt.type_id === b.type_id)?.type_name || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="w-[80%] ml-auto p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setSelectedDeal({
              deal_name: '',
              type_id: '',
              discount: '',
              deal_price: '',
              availability: '',
              start_date: '',
              end_date: '',
              cancellation_policy: ''
            });
            setIsAdding(true);
          }}
          className="ml-auto px-5 py-2 bg-[#1470ef] text-white rounded font-bold hover:bg-[#218838] transition-colors"
        >
          Add Deal
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Room Type</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Deals</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Policy</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Deal Price</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Rate</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Availability</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedDeals.map(deal => (
            <tr key={deal.id}>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">
                {roomTypes.find(rt => rt.type_id === deal.type_id)?.type_name || `Type ${deal.type_id}`}
              </td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{deal.deal_name}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{deal.cancellation_policy}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{deal.deal_price}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{deal.discount}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{deal.availability}</td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => {
                    setSelectedDeal(deal);
                    setIsAdding(false);
                  }}
                  className="cursor-pointer hover:opacity-70 transition"
                >
                  <img src={ellipsisVertical} className="w-5 h-5" alt="Edit" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(isAdding || selectedDeal) && (
        <EditDeal
          deal={selectedDeal}
          roomTypes={roomTypes}
          onSave={handleSave}
          onClose={() => {
            setSelectedDeal(null);
            setIsAdding(false);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default RateTable;
