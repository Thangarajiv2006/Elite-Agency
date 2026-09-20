import React from "react";
import { format } from "date-fns";
import { numberToWords } from "@/utils/numberToWords";
import { useAppSelector } from "@/hooks";
import MKLogo from "@/assets/img/MK Logo.png";
import { formatCurrency } from "@/utils/formatCurrency";

interface InvoicePrintProps {
  order: any;
}

const InvoicePrint: React.FC<InvoicePrintProps> = ({ order }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!order) return null;

  // Fallback defaults from the reference image
  const agencyName = user?.agencyName || "CHENDUR ENTERPRISES";
  const agencyPhone = user?.phone || "7397614599, 9994358314";
  const agencyGst = user?.gst || "33DJIPK4842N1ZT";
  const agencyAddress = user?.address
    ? `${user.address.plotNo}, ${user.address.street}, ${user.address.village}, ${user.address.district} PIN-${user.address.pinCode}`
    : "112/1 MIDDLE STREET, PUTHUKUDI, CHERANMAHADEVI T.K, TIRUNELVELI PIN-627417";
  const agencyState = user?.address?.state || "TAMIL NADU";

  // Calculate generic HSN aggregation stats
  const hsnMap: Record<
    string,
    { gst: number; taxblAmt: number; cgst: number; sgst: number }
  > = {};

  order.orderedProducts?.forEach((item: any) => {
    const hsn = item.product?.HSN || "N/A";
    const gstTotal = (item.product?.CGST || 0) + (item.product?.SGST || 0);

    if (!hsnMap[hsn]) {
      hsnMap[hsn] = { gst: gstTotal, taxblAmt: 0, cgst: 0, sgst: 0 };
    }
    hsnMap[hsn].taxblAmt += item.netPrice || 0;

    // Distribute tax proportionally for HSN summary
    const taxAmt = item.taxAmount || 0;
    const cgstVal = taxAmt / 2;
    const sgstVal = taxAmt / 2;
    hsnMap[hsn].cgst += cgstVal;
    hsnMap[hsn].sgst += sgstVal;
  });

  const totalQty = order.orderedProducts?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  const grandTotalRounded = order.grandTotal || 0;
  const words = numberToWords(grandTotalRounded);

  const salesBy = order?.worker?.name || "SURESH";

  // Manual Pagination Logic
  const CHUNK_SIZE = 35;
  const products = order.orderedProducts || [];
  const productChunks = [];
  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    productChunks.push(products.slice(i, i + CHUNK_SIZE));
  }

  return (
    <div
      id="invoice-print-area"
      className="hidden print:block w-full bg-white text-black font-sans text-xs"
    >
      {productChunks.map((chunk, pageIdx) => {
        const isLastPage = pageIdx === productChunks.length - 1;

        return (
          <div
            key={pageIdx}
            className={`w-full border border-black mx-auto bg-white mb-8 last:mb-0 ${
              !isLastPage ? "break-after-page" : ""
            }`}
            style={{ breakAfter: pageIdx < productChunks.length - 1 ? "page" : "auto" }}
          >
            <div className="w-full">
              {/* HEADER REGION */}
              <div className="p-2 pb-0">
                <div className="flex w-full border-b border-black mb-2 align-stretch">
                  {/* Left Column - Company & Buyer details */}
                  <div className="w-[60%] border-r border-black p-1 pr-2 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-3 items-start">
                        <img
                          src={MKLogo}
                          alt="Logo"
                          className="w-14 h-14 object-contain rounded-md border border-black/5"
                        />
                        <div>
                          <h1 className="font-bold text-lg uppercase leading-none mb-1">
                            {agencyName}
                          </h1>
                          <p className="text-[10px] break-all leading-tight">
                            {agencyAddress}
                          </p>
                          <p className="text-[10px] font-medium mt-0.5">
                            {agencyState}
                          </p>
                          <p className="text-[10px] uppercase mt-0.5">
                            GSTIN :{" "}
                            <span className="font-semibold">{agencyGst}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 border-t border-black pt-1">
                      <p className="text-[10px]">
                        Buyer :{" "}
                        <span className="font-semibold uppercase">
                          {order.shop?.shopName} ,{" "}
                          {order.shop?.address?.village || ""}
                        </span>
                      </p>
                      <p className="text-[10px] uppercase">
                        {order.shop?.ownerName ? `${order.shop.ownerName}` : ""}
                      </p>
                      <p className="text-[10px] uppercase">
                        BT : {order.shop?.address?.district || ""}
                      </p>
                      <p className="text-[10px] mt-1 uppercase">
                        GSTIN : UNREGISTERED DEALER: 1
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Invoice Meta Details */}
                  <div className="w-[40%] flex flex-col items-end p-1">
                    <h2 className="font-bold text-sm border border-black px-4 py-1 mb-2 tracking-wide whitespace-nowrap">
                      TAX INVOICE
                    </h2>

                    <div className="w-full text-[10px] mt-1 space-y-1">
                      <div className="flex border-b border-gray-300 pb-1">
                        <span className="w-16">Phone No.</span>
                        <span className="font-medium">: {agencyPhone}</span>
                      </div>
                      <div className="flex border-b border-gray-300 pb-1">
                        <span className="w-16">Email</span>
                        <span className="font-medium">
                          : {user?.email || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-gray-300 pb-1 pt-1">
                        <div className="flex">
                          <span className="w-8">No.</span>
                          <span className="font-bold">
                            :{" "}
                            {order.invoiceNo ||
                              order._id?.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-8">Date</span>
                          <span className="font-bold">
                            :{" "}
                            {format(
                              new Date(order.invoiceDate || order.createdAt),
                              "dd/MM/yyyy",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-1">
                        <div className="flex">
                          <span className="w-8">Mode</span>
                          <span className="font-bold uppercase">
                            : {order.paymentMode}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-8">Due</span>
                          <span className="font-bold">
                            :{" "}
                            {order.dueDate
                              ? format(new Date(order.dueDate), "dd-MM-yy")
                              : format(
                                  new Date(
                                    order.invoiceDate || order.createdAt,
                                  ),
                                  "dd-MM-yy",
                                )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT TABLE */}
              <div className="p-2 pt-0">
                <div className="border-b border-black mb-1 pb-1">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-y border-black font-semibold bg-gray-50/50">
                        <th className="py-1 px-1 border-r border-black w-8">
                          Sl.
                        </th>
                        <th className="py-1 px-1 border-r border-black">
                          Goods Description
                        </th>
                        <th className="py-1 px-1 border-r border-black">HSN</th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          MRP
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          Qty
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          Free
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right w-[40px]">
                          Rate
                          <br />
                          (Bef.Tax)
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          Disc.
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          Tax
                        </th>
                        <th className="py-1 px-1 border-r border-black text-right">
                          Net Rate
                        </th>
                        <th className="py-1 px-1 text-right">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chunk.map((item: any, itemIdx: number) => {
                        const globalIdx = pageIdx * CHUNK_SIZE + itemIdx;
                        const taxPrc =
                          (item.product?.CGST || 0) + (item.product?.SGST || 0);
                        const rate = item.product?.sellingPrice || 0;
                        const netRate =
                          (item.totalAmount || 0) / (item.quantity || 1);

                        return (
                          <tr
                            key={globalIdx}
                            className="border-b border-gray-200 last:border-0 align-top"
                          >
                            <td className="py-1 px-1 border-r border-black text-center">
                              {globalIdx + 1}
                            </td>
                            <td className="py-1 px-1 border-r border-black w-[28%] uppercase wrap-break-word">
                              {item.product?.name}
                            </td>
                            <td className="py-1 px-1 border-r border-black">
                              {item.product?.HSN || "-"}
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {formatCurrency(item.product?.MRP || rate)}
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {item.quantity} PCS
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {item.free || "-"}
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {formatCurrency(rate)}
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {item.discount || "-"}
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {taxPrc}%
                            </td>
                            <td className="py-1 px-1 border-r border-black text-right">
                              {formatCurrency(netRate)}
                            </td>
                            <td className="py-1 px-1 text-right font-medium">
                              {formatCurrency(item.totalAmount || 0)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Fill empty rows to keep uniform height on all pages if wanted,
                          but here we just show the footer on the last page */}
                    </tbody>
                    {isLastPage && (
                      <tfoot>
                        <tr className="border-t border-black font-bold">
                          <td
                            colSpan={4}
                            className="py-1 px-1 border-r border-black text-center"
                          >
                            TOTAL
                          </td>
                          <td className="py-1 px-1 border-r border-black text-right">
                            {totalQty} PCS
                          </td>
                          <td
                            colSpan={5}
                            className="py-1 px-1 border-r border-black"
                          ></td>
                          <td className="py-1 px-1 text-right">
                            {formatCurrency(order.grandTotal || 0)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* FOOTER SECTION: ONLY ON LAST PAGE */}
              {isLastPage && (
                <div className="p-2 border-t border-black">
                  <div className="flex w-full">
                    {/* HSN Chart & Sales Details */}
                    <div className="w-1/2 border-r border-black pr-2 flex flex-col justify-between">
                      <table className="w-full text-left text-[9px]">
                        <thead>
                          <tr className="border-b border-black">
                            <th>HSN</th>
                            <th className="text-right">GST</th>
                            <th className="text-right">TXBL.AMT.</th>
                            <th className="text-right">CGST</th>
                            <th className="text-right">SGST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(hsnMap).map(([hsn, vl]) => (
                            <tr key={hsn}>
                              <td className="py-[2px]">{hsn}</td>
                              <td className="text-right">{vl.gst}%</td>
                              <td className="text-right">
                                {formatCurrency(vl.taxblAmt)}
                              </td>
                              <td className="text-right">
                                {formatCurrency(vl.cgst)}{" "}
                                <span className="text-[7px]">
                                  {(vl.gst / 2).toFixed(1)}%
                                </span>
                              </td>
                              <td className="text-right">
                                {formatCurrency(vl.sgst)}{" "}
                                <span className="text-[7px]">
                                  {(vl.gst / 2).toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="mt-4 text-[10px]">
                        <div className="font-semibold uppercase pb-1 flex justify-between">
                          <span>SUB TOTAL ROUNDED-OFF</span>
                          <span className="font-bold">Rupees {words}</span>
                        </div>
                        <div className="border-t border-black pt-2 mt-2 flex justify-between text-xs font-semibold">
                          <div>Handled By : {salesBy}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Signature Area */}
                    <div className="w-1/2 pl-2 flex flex-col justify-between ml-2">
                      <div className="flex justify-between items-start mt-1">
                        <div className="text-[10px] pl-1 font-medium italic">
                          Party Signature
                        </div>
                        <div className="flex flex-col items-end pl-2">
                          <div className="flex w-32 justify-end text-[11px] mb-0.5 gap-2">
                            <span className="text-xs">
                              {formatCurrency(
                                order.grandTotal - (order.roundOff || 0),
                              )}
                            </span>
                          </div>
                          {order.roundOff !== 0 && (
                            <div className="flex w-32 justify-end text-[11px] mb-0.5 gap-2">
                              <span>
                                {order.roundOff > 0 ? "+" : ""}
                                {formatCurrency(order.roundOff || 0)}
                              </span>
                            </div>
                          )}
                          <div className="flex w-40 justify-end font-bold text-sm border-t border-black pt-1">
                            <span className="mr-2 font-black">Rs.</span>
                            <span className="text-base">
                              {formatCurrency(grandTotalRounded)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pr-2 pt-6 mt-12 pb-2">
                        <div className="text-[10px] text-center border-t border-dashed border-gray-600 w-44 pt-1 font-bold uppercase tracking-wide">
                          For {agencyName}
                          <br />
                          <span className="text-[9px] font-normal lowercase">
                            (Authorized Signatory)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvoicePrint;
