import React from "react";

const page = () => {
  const data = [
    { category: "Retail", fee: 10 },
    { category: "Fashion and Apparel", fee: 25 },
    { category: "Electronics", fee: 70 },
    { category: "Home And Furniture", fee: 60 },
    { category: "Beauty and Personal Care", fee: 35 },
    { category: "Health and Wellness", fee: 38 },
    { category: "Food and Grocery", fee: 21 },
    { category: "Books and Media", fee: 30 },
    { category: "Toys and Games", fee: 40 },
    { category: "Jewellery and Accessories", fee: 65 },
    { category: "Art and Crafts", fee: 28 },
    { category: "Sports and Outdoors", fee: 40 },
    { category: "Electronics Accessories", fee: 15 },
    { category: "Handmade and Artisanal Products", fee: 19 },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-[#0D0D0D] ">
        <thead>
          <tr>
            <th className="px-4 py-4 border-b">Category</th>
            <th className="px-4 py-4 border-b">Fulfillment Fee (INR)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-4 border-b">{item.category}</td>
              <td className="px-4 py-4 border-b">{item.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default page;
