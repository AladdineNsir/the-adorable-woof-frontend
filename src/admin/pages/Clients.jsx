import { useEffect, useMemo, useState } from "react";

import {
  Mail,
  Phone,
  Search,
  ShoppingCart,
  User,
  Users,
  Wallet,
  X,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";

import {
  getClients,
  deleteClient,
} from "../services/clientApi";


const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "-";


export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);


  /* =====================================================
     CHARGEMENT CLIENTS
  ===================================================== */

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await getClients();

        setClients(data.clients || []);
      } catch (error) {
        console.error(
          "Erreur chargement clients :",
          error
        );

        toast.error(
          "Impossible de charger les clients."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);


  /* =====================================================
     RECHERCHE
  ===================================================== */

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.name
          ?.toLowerCase()
          .includes(query) ||

        client.email
          ?.toLowerCase()
          .includes(query) ||

        client.phone
          ?.toLowerCase()
          .includes(query)
    );
  }, [clients, search]);


  /* =====================================================
     STATISTIQUES
  ===================================================== */

  const totalClients = clients.length;

  const totalOrders = clients.reduce(
    (total, client) =>
      total + Number(client.ordersCount || 0),
    0
  );

  const totalSpent = clients.reduce(
    (total, client) =>
      total + Number(client.totalSpent || 0),
    0
  );


  /* =====================================================
     SUPPRESSION CLIENT
  ===================================================== */

  const handleDeleteClient = async (clientId) => {
    const client = clients.find(
      (item) => item._id === clientId
    );

    if (!client) {
      return;
    }


    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le client "${client.name || "Client"}" ?`
    );


    if (!confirmed) {
      return;
    }


    try {
      setDeletingId(clientId);

      await deleteClient(clientId);


      setClients((prevClients) =>
        prevClients.filter(
          (item) => item._id !== clientId
        )
      );


      toast.success(
        "Client supprimé avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur suppression client :",
        error
      );


      toast.error(
        error?.response?.data?.message ||
          "Impossible de supprimer le client."
      );
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <AdminPageHeader
        title="Clients"
        breadcrumb={["Clients"]}
      />


      <div className="w-full px-3 py-4 sm:px-5 sm:py-6 md:px-6 lg:px-7">

        {/* =====================================================
            STATISTIQUES
        ===================================================== */}

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">

          {/* CLIENTS */}

          <div className="rounded-xl border border-[#E7DED2] bg-white p-4 shadow-[0_6px_24px_rgba(17,17,17,0.035)] sm:p-5">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray sm:text-[10px]">
                  Clients
                </p>

                <p className="mt-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                  {totalClients}
                </p>

                <p className="mt-1 truncate text-[11px] text-velora-textGray sm:text-xs">
                  comptes enregistrés
                </p>

              </div>


              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold sm:h-11 sm:w-11">
                <Users size={19} />
              </div>

            </div>

          </div>


          {/* COMMANDES */}

          <div className="rounded-xl border border-[#E7DED2] bg-white p-4 shadow-[0_6px_24px_rgba(17,17,17,0.035)] sm:p-5">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray sm:text-[10px]">
                  Commandes
                </p>

                <p className="mt-2 font-premium text-2xl font-bold text-velora-dark sm:text-3xl">
                  {totalOrders}
                </p>

                <p className="mt-1 truncate text-[11px] text-velora-textGray sm:text-xs">
                  commandes enregistrées
                </p>

              </div>


              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold sm:h-11 sm:w-11">
                <ShoppingCart size={19} />
              </div>

            </div>

          </div>


          {/* TOTAL */}

          <div className="rounded-xl border border-[#E7DED2] bg-white p-4 shadow-[0_6px_24px_rgba(17,17,17,0.035)] sm:col-span-2 sm:p-5 lg:col-span-1">

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-velora-textGray sm:text-[10px]">
                  Total achats
                </p>

                <p className="mt-2 truncate font-premium text-2xl font-bold text-velora-dark sm:text-3xl">

                  {totalSpent.toFixed(2)}

                  <span className="ml-1 text-sm font-semibold">
                    DT
                  </span>

                </p>

                <p className="mt-1 truncate text-[11px] text-velora-textGray sm:text-xs">
                  valeur totale des commandes
                </p>

              </div>


              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold sm:h-11 sm:w-11">
                <Wallet size={19} />
              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            RECHERCHE
        ===================================================== */}

        <div className="mb-5 rounded-xl border border-[#E7DED2] bg-white p-3 shadow-[0_6px_24px_rgba(17,17,17,0.035)] sm:p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="relative w-full sm:flex-1">

              <div className="flex h-10 w-full items-center rounded-lg border border-[#E7DED2] bg-[#FCFAF7] px-3 transition focus-within:border-velora-gold/70 focus-within:ring-2 focus-within:ring-velora-gold/10 sm:h-11">

                <Search
                  size={17}
                  className="shrink-0 text-velora-textGray"
                />


                <input
                  type="text"
                  aria-label="Rechercher un client"
                  placeholder="Rechercher un client..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="h-full min-w-0 flex-1 bg-transparent pl-3 pr-8 text-xs text-velora-dark outline-none placeholder:text-velora-textGray sm:text-sm"
                />


                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-md text-velora-textGray hover:bg-[#F1E9DF] hover:text-velora-dark"
                  >
                    <X size={14} />
                  </button>
                )}

              </div>

            </div>


            <div className="flex items-center justify-between sm:justify-end">

              <span className="text-[11px] text-velora-textGray sm:text-xs">

                {search
                  ? `${filteredClients.length} résultat${
                      filteredClients.length > 1
                        ? "s"
                        : ""
                    }`
                  : `${totalClients} client${
                      totalClients > 1
                        ? "s"
                        : ""
                    }`}

              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-[#E7DED2] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]">

            <div className="text-center">

              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#E7DED2] border-t-velora-gold" />

              <p className="text-xs text-velora-textGray sm:text-sm">
                Chargement des clients...
              </p>

            </div>

          </div>

        ) : (

          <>

            {/* =================================================
                DESKTOP / TABLET
            ================================================= */}

            <div className="hidden overflow-hidden rounded-xl border border-[#E7DED2] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)] md:block">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-[#E7DED2] bg-[#FCFAF7] px-4 py-4 lg:px-5">

                <div className="min-w-0">

                  <p className="text-sm font-semibold text-velora-dark">
                    Liste des clients
                  </p>

                  <p className="mt-0.5 text-[11px] text-velora-textGray">
                    Coordonnées et historique d’achat
                  </p>

                </div>


                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E7DED2] bg-white text-velora-textGray">
                  <Users size={15} />
                </div>

              </div>


              {/* TABLE */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead className="border-b border-[#E7DED2]">

                    <tr className="text-left text-[9px] font-bold uppercase tracking-[0.13em] text-velora-textGray lg:text-[10px]">

                      <th className="px-4 py-4 lg:px-5">
                        Client
                      </th>

                      <th className="px-4 py-4 lg:px-5">
                        Contact
                      </th>

                      <th className="px-4 py-4 lg:px-5">
                        Adresse
                      </th>

                      <th className="px-4 py-4 lg:px-5">
                        Commandes
                      </th>

                      <th className="px-4 py-4 lg:px-5">
                        Total
                      </th>

                      <th className="px-4 py-4 lg:px-5">
                        Inscription
                      </th>

                      <th className="px-5 py-4 text-right">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-[#F1E9DF]">

                    {filteredClients.length === 0 ? (

                      <tr>

                        <td
                          colSpan="7"
                          className="px-5 py-14 text-center text-sm text-velora-textGray"
                        >
                          Aucun client trouvé.
                        </td>

                      </tr>

                    ) : (

                      filteredClients.map((client) => (

                        <tr
                          key={client._id}
                          className="transition-colors hover:bg-[#FCFAF7]"
                        >

                          {/* CLIENT */}

                          <td className="px-4 py-4 lg:px-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-velora-gold text-xs font-bold text-white lg:h-10 lg:w-10 lg:text-sm">

                                {client.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "C"}

                              </div>


                              <div className="min-w-0">

                                <p className="truncate text-xs font-semibold text-velora-dark lg:text-sm">
                                  {client.name ||
                                    "Client"}
                                </p>


                                <span className="mt-1 inline-flex rounded-full bg-[#FBF4E9] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-velora-gold">
                                  {client.role ||
                                    "Client"}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* CONTACT */}

                          <td className="px-4 py-4 lg:px-5">

                            <div className="space-y-1.5">

                              <p className="flex max-w-[220px] items-center gap-2 truncate text-xs text-velora-dark">

                                <Mail
                                  size={13}
                                  className="shrink-0 text-velora-gold"
                                />

                                <span className="truncate">
                                  {client.email || "-"}
                                </span>

                              </p>


                              <p className="flex items-center gap-2 text-xs text-velora-textGray">

                                <Phone
                                  size={13}
                                  className="shrink-0"
                                />

                                {client.phone || "-"}
                              </p>

                            </div>

                          </td>


                          {/* ADRESSE */}

                          <td className="px-4 py-4 lg:px-5">

                            <div className="max-w-[180px] text-xs leading-5 text-velora-textGray">

                              <p className="truncate text-velora-dark">
                                {client.address?.street ||
                                  "-"}
                              </p>

                              <p>
                                {client.address?.city ||
                                  ""}{" "}
                                {client.address?.zipCode ||
                                  ""}
                              </p>

                            </div>

                          </td>


                          {/* COMMANDES */}

                          <td className="px-4 py-4 lg:px-5">

                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7DED2] bg-[#FBF8F2] px-2.5 py-1.5 text-xs font-semibold text-velora-dark">

                              <ShoppingCart
                                size={13}
                                className="text-velora-gold"
                              />

                              {client.ordersCount ||
                                0}

                            </span>

                          </td>


                          {/* TOTAL */}

                          <td className="px-4 py-4 lg:px-5">

                            <span className="text-xs font-semibold text-velora-dark lg:text-sm">

                              {Number(
                                client.totalSpent ||
                                  0
                              ).toFixed(2)}{" "}

                              DT

                            </span>

                          </td>


                          {/* DATE */}

                          <td className="px-4 py-4 lg:px-5">

                            <span className="inline-flex items-center gap-1.5 text-xs text-velora-textGray">

                              <User
                                size={13}
                                className="text-velora-gold"
                              />

                              {formatDate(
                                client.createdAt
                              )}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteClient(
                                  client._id
                                )
                              }
                              disabled={
                                deletingId ===
                                client._id
                              }
                              className="
                                inline-flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                border border-red-100
                                bg-red-50
                                text-red-500
                                transition-all duration-200
                                hover:border-red-200
                                hover:bg-red-500
                                hover:text-white
                                active:scale-95
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                              title="Supprimer le client"
                              aria-label={`Supprimer ${
                                client.name ||
                                "ce client"
                              }`}
                            >

                              {deletingId ===
                              client._id ? (

                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />

                              ) : (

                                <Trash2
                                  size={16}
                                  strokeWidth={1.8}
                                />

                              )}

                            </button>

                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =================================================
                MOBILE
            ================================================= */}

            <div className="space-y-3 md:hidden">

              {filteredClients.length === 0 ? (

                <div className="rounded-xl border border-[#E7DED2] bg-white px-5 py-14 text-center shadow-[0_6px_24px_rgba(17,17,17,0.035)]">

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBF4E9] text-velora-gold">
                    <Users size={19} />
                  </div>


                  <p className="mt-4 text-sm font-semibold text-velora-dark">
                    Aucun client trouvé
                  </p>


                  <p className="mt-1 text-xs text-velora-textGray">
                    Essayez une autre recherche.
                  </p>


                  {search && (

                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="mt-4 text-xs font-semibold text-velora-gold"
                    >
                      Effacer la recherche
                    </button>

                  )}

                </div>

              ) : (

                filteredClients.map((client) => (

                  <div
                    key={client._id}
                    className="overflow-hidden rounded-xl border border-[#E7DED2] bg-white shadow-[0_6px_24px_rgba(17,17,17,0.035)]"
                  >

                    {/* CARD HEADER */}

                    <div className="flex items-center gap-3 border-b border-[#F1E9DF] bg-[#FCFAF7] p-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-velora-gold text-sm font-bold text-white">

                        {client.name
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "C"}

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-velora-dark">
                          {client.name ||
                            "Client"}
                        </p>


                        <span className="mt-1 inline-flex rounded-full bg-[#FBF4E9] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-velora-gold">
                          {client.role ||
                            "Client"}
                        </span>

                      </div>


                      <div className="shrink-0 text-right">

                        <p className="text-sm font-bold text-velora-dark">

                          {Number(
                            client.totalSpent ||
                              0
                          ).toFixed(2)}{" "}

                          DT

                        </p>


                        <p className="mt-0.5 text-[10px] text-velora-textGray">
                          Total achats
                        </p>

                      </div>

                    </div>


                    {/* CARD BODY */}

                    <div className="space-y-4 p-4">

                      {/* EMAIL */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold">
                          <Mail size={14} />
                        </div>


                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                            Email
                          </p>


                          <p className="mt-1 break-all text-xs text-velora-dark">
                            {client.email || "-"}
                          </p>

                        </div>

                      </div>


                      {/* TELEPHONE */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold">
                          <Phone size={14} />
                        </div>


                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                            Téléphone
                          </p>


                          <p className="mt-1 text-xs text-velora-dark">
                            {client.phone || "-"}
                          </p>

                        </div>

                      </div>


                      {/* ADRESSE */}

                      <div className="flex items-start gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FBF4E9] text-velora-gold">
                          <User size={14} />
                        </div>


                        <div className="min-w-0">

                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                            Adresse
                          </p>


                          <p className="mt-1 text-xs leading-5 text-velora-dark">

                            {client.address?.street ||
                              "-"}

                            <br />

                            {client.address?.city ||
                              ""}{" "}

                            {client.address?.zipCode ||
                              ""}

                          </p>

                        </div>

                      </div>

                    </div>


                    {/* CARD FOOTER */}

                    <div className="flex items-center justify-between border-t border-[#F1E9DF] bg-[#FCFAF7] px-4 py-3">

                      <div className="flex items-center gap-2">

                        <ShoppingCart
                          size={14}
                          className="text-velora-gold"
                        />

                        <span className="text-xs font-semibold text-velora-dark">

                          {client.ordersCount ||
                            0}{" "}

                          commande
                          {client.ordersCount > 1
                            ? "s"
                            : ""}

                        </span>

                      </div>


                      <div className="flex items-center gap-3">

                        <span className="text-[10px] text-velora-textGray">

                          Inscrit le{" "}
                          {formatDate(
                            client.createdAt
                          )}

                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClient(
                              client._id
                            )
                          }
                          disabled={
                            deletingId ===
                            client._id
                          }
                          title="Supprimer le client"
                          aria-label={`Supprimer ${
                            client.name ||
                            "ce client"
                          }`}
                          className="
                            inline-flex h-9 w-9
                            shrink-0
                            items-center justify-center
                            rounded-lg
                            border border-red-100
                            bg-red-50
                            text-red-500
                            transition-all duration-200
                            hover:border-red-200
                            hover:bg-red-500
                            hover:text-white
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >

                          {deletingId ===
                          client._id ? (

                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />

                          ) : (

                            <Trash2
                              size={15}
                              strokeWidth={1.8}
                            />

                          )}

                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>

          </>

        )}

      </div>
    </>
  );
}