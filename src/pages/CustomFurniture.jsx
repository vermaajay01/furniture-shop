import { useEffect, useState } from "react";

import {
  Send,
  Loader2,
  CheckCircle,
  Upload,
  MessageCircle,
} from "lucide-react";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CustomFurniture() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    furnitureType: "",
    dimensions: "",
    material: "",
    budget: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  const [whatsappNumber, setWhatsappNumber] =
    useState("919596492640");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================================
  // LOAD SHOP WHATSAPP NUMBER
  // ======================================================

  useEffect(() => {
    const loadWebsiteSettings = async () => {
      try {
        const settingsRef = doc(
          db,
          "settings",
          "website"
        );

        const snapshot =
          await getDoc(settingsRef);

        if (snapshot.exists()) {
          const settings =
            snapshot.data();

          if (settings.whatsapp) {
            const cleanNumber =
              String(
                settings.whatsapp
              ).replace(/\D/g, "");

            if (cleanNumber) {
              setWhatsappNumber(
                cleanNumber
              );
            }
          }
        }
      } catch (err) {
        console.error(
          "Unable to load WhatsApp number:",
          err
        );
      }
    };

    loadWebsiteSettings();
  }, []);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ======================================================
  // HANDLE IMAGE
  // ======================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);
  };

  // ======================================================
  // SUBMIT REQUEST
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.furnitureType.trim()
    ) {
      setError(
        "Please fill in your name, phone number and furniture type."
      );

      return;
    }

    try {
      setSubmitting(true);

      // ====================================================
      // 1. SAVE CUSTOMER REQUEST
      // ====================================================

      const requestRef =
        await addDoc(
          collection(
            db,
            "customRequests"
          ),
          {
            name:
              form.name.trim(),

            phone:
              form.phone.trim(),

            email:
              form.email.trim(),

            furnitureType:
              form.furnitureType.trim(),

            dimensions:
              form.dimensions.trim(),

            material:
              form.material.trim(),

            budget:
              form.budget.trim(),

            description:
              form.description.trim(),

            // Image name for now.
            // Firebase Storage can be
            // connected later.

            imageName:
              image?.name || "",

            status: "new",

            read: false,

            createdAt:
              serverTimestamp(),
          }
        );

      // ====================================================
      // 2. CREATE ADMIN NOTIFICATION
      // ====================================================

      await addDoc(
        collection(
          db,
          "notifications"
        ),
        {
          type:
            "custom_request",

          title:
            "New Furniture Enquiry",

          message: `${form.name.trim()} submitted a new ${form.furnitureType.trim()} enquiry.`,

          requestId:
            requestRef.id,

          customerName:
            form.name.trim(),

          customerPhone:
            form.phone.trim(),

          furnitureType:
            form.furnitureType.trim(),

          read: false,

          createdAt:
            serverTimestamp(),
        }
      );

      // ====================================================
      // 3. CREATE WHATSAPP MESSAGE
      // ====================================================

      const whatsappMessage = `
Hello Hari Om Furniture House 👋

I would like to discuss a custom furniture requirement.

👤 Name: ${form.name.trim()}

📞 Phone: ${form.phone.trim()}

📧 Email: ${
        form.email.trim() ||
        "Not provided"
      }

🪑 Furniture Type: ${
        form.furnitureType.trim()
      }

📏 Dimensions: ${
        form.dimensions.trim() ||
        "Not specified"
      }

🪵 Material: ${
        form.material.trim() ||
        "Not specified"
      }

💰 Budget: ${
        form.budget.trim() ||
        "Not specified"
      }

📝 Requirement:
${
        form.description.trim() ||
        "Not specified"
      }

🖼️ Reference Image:
${
        image?.name ||
        "No image uploaded"
      }

Thank you.
`.trim();

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(
          whatsappMessage
        );

      // ====================================================
      // 4. OPEN WHATSAPP
      // ====================================================

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // ====================================================
      // 5. SUCCESS
      // ====================================================

      setSubmitted(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        furnitureType: "",
        dimensions: "",
        material: "",
        budget: "",
        description: "",
      });

      setImage(null);

    } catch (err) {
      console.error(
        "Custom furniture request error:",
        err
      );

      setError(
        "Unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // SUCCESS SCREEN
  // ======================================================

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F1E7]">

        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">

          <div className="w-full max-w-xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F8F1E7] text-[#8B2E2E]">

              <CheckCircle
                size={34}
              />

            </div>

            <h1 className="mt-6 text-3xl font-bold text-[#2B1714]">
              Request Submitted
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              Thank you for contacting Hari
              Om Furniture House. Your
              enquiry has been saved and
              WhatsApp has been opened for
              direct communication with our
              team.
            </p>

            <button
              type="button"
              onClick={() =>
                setSubmitted(false)
              }
              className="mt-8 bg-[#8B2E2E] px-7 py-4 font-semibold text-white transition hover:bg-[#6B1E1E]"
            >
              Submit Another Request
            </button>

          </div>

        </main>

        <Footer />

      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-[#2B1714]">

      <Navbar />

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="bg-[#3A0D0D] px-6 py-24 text-white">

        <div className="mx-auto max-w-7xl">

          <p className="text-sm uppercase tracking-[0.3em] text-[#E0B66B]">
            Made for you
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold md:text-6xl">
            Create furniture that fits your
            space.
          </h1>

          <p className="mt-6 max-w-2xl leading-8 text-white/70">
            Tell us about your idea,
            dimensions, preferred material
            and budget. Our team will help
            turn your vision into beautiful
            furniture.
          </p>

        </div>

      </section>

      {/* ==================================================
          FORM
      ================================================== */}

      <main className="px-6 py-16">

        <div className="mx-auto max-w-4xl">

          <div className="bg-white p-8 shadow-sm md:p-12">

            <div className="mb-10">

              <p className="text-sm uppercase tracking-[0.3em] text-[#8B2E2E]">
                Custom Quote
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Tell us what you need
              </h2>

              <p className="mt-3 text-gray-500">
                Fields marked with * are
                required.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* ==================================================
                  CUSTOMER INFORMATION
              ================================================== */}

              <div>

                <h3 className="mb-5 text-lg font-semibold">
                  Your Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* NAME */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your name"
                      className="w-full border border-gray-200 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
                      required
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter phone number"
                      className="w-full border border-gray-200 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
                      required
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your email"
                      className="w-full border border-gray-200 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
                    />

                  </div>

                </div>

              </div>

              {/* ==================================================
                  FURNITURE DETAILS
              ================================================== */}

              <div className="border-t border-gray-100 pt-8">

                <h3 className="mb-5 text-lg font-semibold">
                  Furniture Details
                </h3>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* TYPE */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Furniture Type *
                    </label>

                    <select
                      name="furnitureType"
                      value={
                        form.furnitureType
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#8B2E2E]"
                      required
                    >

                      <option value="">
                        Select furniture
                      </option>

                      <option value="Sofa">
                        Sofa
                      </option>

                      <option value="Bed">
                        Bed
                      </option>

                      <option value="Dining Table">
                        Dining Table
                      </option>

                      <option value="Chair">
                        Chair
                      </option>

                      <option value="Wardrobe">
                        Wardrobe
                      </option>

                      <option value="TV Unit">
                        TV Unit
                      </option>

                      <option value="Study Table">
                        Study Table
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* DIMENSIONS */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Dimensions
                    </label>

                    <input
                      type="text"
                      name="dimensions"
                      value={
                        form.dimensions
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. 6 × 3 × 3 ft"
                      className="w-full border border-gray-200 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
                    />

                  </div>

                  {/* MATERIAL */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Preferred Material
                    </label>

                    <select
                      name="material"
                      value={
                        form.material
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#8B2E2E]"
                    >

                      <option value="">
                        Select material
                      </option>

                      <option value="Solid Wood">
                        Solid Wood
                      </option>

                      <option value="Sheesham Wood">
                        Sheesham Wood
                      </option>

                      <option value="Teak Wood">
                        Teak Wood
                      </option>

                      <option value="Plywood">
                        Plywood
                      </option>

                      <option value="Wood & Fabric">
                        Wood & Fabric
                      </option>

                      <option value="Not Sure">
                        Not Sure
                      </option>

                    </select>

                  </div>

                  {/* BUDGET */}

                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      Approximate Budget
                    </label>

                    <select
                      name="budget"
                      value={
                        form.budget
                      }
                      onChange={
                        handleChange
                      }
                      className="w-full border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#8B2E2E]"
                    >

                      <option value="">
                        Select budget
                      </option>

                      <option value="Below ₹25,000">
                        Below ₹25,000
                      </option>

                      <option value="₹25,000 - ₹50,000">
                        ₹25,000 - ₹50,000
                      </option>

                      <option value="₹50,000 - ₹1,00,000">
                        ₹50,000 - ₹1,00,000
                      </option>

                      <option value="Above ₹1,00,000">
                        Above ₹1,00,000
                      </option>

                    </select>

                  </div>

                </div>

              </div>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              <div className="border-t border-gray-100 pt-8">

                <label className="mb-2 block text-sm font-medium">
                  Describe Your Requirement
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={6}
                  placeholder="Tell us about your design, colour, finish, storage requirements, etc."
                  className="w-full resize-none border border-gray-200 px-4 py-3 outline-none transition focus:border-[#8B2E2E]"
                />

              </div>

              {/* ==================================================
                  IMAGE
              ================================================== */}

              <div className="border-t border-gray-100 pt-8">

                <label className="mb-2 block text-sm font-medium">
                  Upload Reference Image
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-gray-300 p-5 transition hover:border-[#8B2E2E]">

                  <Upload
                    size={22}
                    className="text-[#8B2E2E]"
                  />

                  <div>

                    <p className="font-medium">
                      Choose an image
                    </p>

                    <p className="text-xs text-gray-500">
                      {image
                        ? image.name
                        : "JPG, PNG or WEBP"}
                    </p>

                  </div>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                </label>

              </div>

              {/* ==================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* ==================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 bg-[#8B2E2E] px-7 py-4 font-semibold text-white transition hover:bg-[#6B1E1E] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {submitting ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Sending Request...
                  </>
                ) : (
                  <>
                    <MessageCircle
                      size={20}
                    />

                    Submit Custom Request

                    <Send size={18} />
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default CustomFurniture;