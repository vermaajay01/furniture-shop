import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";

function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) return;

    return onSnapshot(
      collection(db, "customers", user.uid, "addresses"),
      (snapshot) => {
        setAddresses(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      },
      (error) =>
        console.error("Address loading failed:", error)
    );
  }, [user]);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    if (!user) return;

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      alert("Name, phone and address are required.");
      return;
    }

    const addressRef = doc(
      collection(db, "customers", user.uid, "addresses")
    );

    await setDoc(addressRef, {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setForm({
      label: "Home",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

    setModalOpen(false);
  };

  const removeAddress = async (id) => {
    if (!user) return;
    if (!window.confirm("Delete this saved address?")) return;

    await deleteDoc(
      doc(
        db,
        "customers",
        user.uid,
        "addresses",
        id
      )
    );
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        Please login to manage your addresses.
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#F8F1E7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B8863B]">
              Customer Account
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#6B1E1E]">
              Saved Addresses
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#6B1E1E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#8B2E2E]"
          >
            <Plus size={18} />
            Add Address
          </button>
        </div>

        {!addresses.length ? (
          <div className="mt-8 bg-white p-10 text-center shadow-sm">
            <MapPin
              size={45}
              className="mx-auto text-gray-300"
            />
            <h2 className="mt-4 font-bold text-[#6B1E1E]">
              No saved addresses
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Save an address for faster ordering.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#6B1E1E]">
                      {address.label || "Address"}
                    </p>
                    <p className="mt-2 font-semibold">
                      {address.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {address.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAddress(address.id)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label="Delete address"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {address.address}
                  {address.city ? `, ${address.city}` : ""}
                  {address.state ? `, ${address.state}` : ""}
                  {address.pincode ? ` - ${address.pincode}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#6B1E1E]">
                  Add Address
                </h2>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={21} />
                </button>
              </div>

              <form
                onSubmit={saveAddress}
                className="mt-6 space-y-4"
              >
                {[
                  ["label", "Label", "Home"],
                  ["name", "Name", "Full name"],
                  ["phone", "Phone", "Phone number"],
                  ["address", "Address", "Delivery address"],
                  ["city", "City", "City"],
                  ["state", "State", "State"],
                  ["pincode", "Pincode", "Pincode"],
                ].map(([name, label, placeholder]) => (
                  <div key={name}>
                    <label className="mb-1 block text-sm font-semibold">
                      {label}
                    </label>
                    <input
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 px-4 py-3 outline-none focus:border-[#8B2E2E]"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-[#6B1E1E] px-5 py-3 font-semibold text-white hover:bg-[#8B2E2E]"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Addresses;
