import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Search,
  ShoppingCart,
  User,
  Users,
  Wallet,
  Trash2,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import AdminPageHeader from "../components/AdminPageHeader";

import {
  getClients,
  deleteClient,
} from "../services/clientApi";

/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "-";

const formatMoney = (value) =>
  `${Number(value || 0).toFixed(2)} DT`;

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#E7DED2]
        bg-white
        p-4
        shadow-[0_8px_28px_rgba(17,17,17,0.035)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-[0_12px_32px_rgba(17,17,17,0.055)]
        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#918579]
              sm:text-[10px]
            "
          >
            {label}
          </p>

          <p
            className="
              mt-2
              font-premium
              text-[26px]
              font-bold
              leading-none
              text-velora-dark
              sm:text-[30px]
            "
          >
            {value}
          </p>

          <p
            className="
              mt-2
              truncate
              text-[10px]
              text-velora-textGray
              sm:text-[11px]
            "
          >
            {description}
          </p>
        </div>

        <div
          className="
            flex h-10 w-10
            shrink-0
            items-center justify-center
            rounded-xl
            bg-[#FBF4E9]
            text-velora-gold
            sm:h-11 sm:w-11
          "
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CLIENT AVATAR
========================================================= */

function ClientAvatar({ name }) {
  const initials =
    name
      ?.trim()
      ?.split(/\s+/)
      ?.map((word) => word.charAt(0))
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "C";

  return (
    <div
      className="
        flex h-10 w-10
        shrink-0
        items-center justify-center
        rounded-xl
        bg-[#F7EEE5]
        text-xs
        font-bold
        text-velora-gold
        ring-1 ring-[#EBDAC8]
      "
    >
      {initials}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ search, onClear }) {
  return (
    <div className="px-5 py-16 text-center">
      <div
        className="
          mx-auto
          flex h-12 w-12
          items-center justify-center
          rounded-2xl
          bg-[#FBF4E9]
          text-velora-gold
        "
      >
        <Users size={20} strokeWidth={1.8} />
      </div>

      <p className="mt-4 text-sm font-semibold text-velora-dark">
        Aucun client trouvé
      </p>

      <p className="mt-1 text-xs text-velora-textGray">
        {search
          ? "Essayez une autre recherche."
          : "Aucun client enregistré pour le moment."}
      </p>

      {search && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-4
            text-xs
            font-semibold
            text-velora-gold
            transition
            hover:text-velora-dark
            hover:underline
            hover:underline-offset-4
          "
        >
          Effacer la recherche
        </button>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  /* =======================================================
     CHARGEMENT
  ======================================================= */

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);

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

  /* =======================================================
     RECHERCHE
  ======================================================= */

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      return (
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
    });
  }, [clients, search]);

  /* =======================================================
     STATISTIQUES
  ======================================================= */

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

  /* =======================================================
     SUPPRESSION
  ======================================================= */

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

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="Gérez vos clients et consultez leur activité d’achat."
        breadcrumb={["Clients"]}
      />

      <div className="w-full p-4 sm:p-6 lg:p-7">

        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-3
            sm:grid-cols-2
            xl:grid-cols-3
            sm:gap-4
          "
        >
          <StatCard
            icon={Users}
            label="Clients"
            value={totalClients}
            description="Comptes enregistrés"
          />

          <StatCard
            icon={ShoppingCart}
            label="Commandes"
            value={totalOrders}
            description="Commandes enregistrées"
          />

          <StatCard
            icon={Wallet}
            label="Total achats"
            value={formatMoney(totalSpent)}
            description="Valeur totale des commandes"
          />
        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mt-5">
          <div
            className="
              rounded-2xl
              border border-[#E7DED2]
              bg-white
              p-3
              shadow-[0_8px_28px_rgba(17,17,17,0.035)]
              sm:p-4
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <label
                className="
                  relative
                  flex h-11
                  min-w-0
                  flex-1
                  items-center
                  rounded-xl
                  border border-[#E7DED2]
                  bg-[#FCFAF7]
                  px-3.5
                  transition-all duration-200
                  focus-within:border-velora-gold
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-velora-gold/10
                "
              >
                <Search
                  size={17}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#918579]"
                />

                <input
                  type="text"
                  aria-label="Rechercher un client"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="
                    h-full
                    min-w-0
                    flex-1
                    bg-transparent
                    pl-3
                    pr-8
                    text-sm
                    text-velora-dark
                    outline-none
                    placeholder:text-[#A59A90]
                  "
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="
                      absolute
                      right-2.5
                      flex h-7 w-7
                      items-center
                      justify-center
                      rounded-lg
                      text-[#918579]
                      transition
                      hover:bg-[#F5EEE7]
                      hover:text-velora-gold
                    "
                    aria-label="Effacer"
                  >
                    <X size={14} />
                  </button>
                )}
              </label>

              <div className="flex items-center justify-between sm:justify-end">
                <span className="text-[11px] text-velora-textGray sm:text-xs">
                  <strong className="font-semibold text-velora-dark">
                    {filteredClients.length}
                  </strong>{" "}
                  résultat
                  {filteredClients.length > 1
                    ? "s"
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="mt-5">
          {loading ? (
            <div
              className="
                flex min-h-[320px]
                items-center justify-center
                rounded-2xl
                border border-[#E7DED2]
                bg-white
                shadow-[0_8px_28px_rgba(17,17,17,0.035)]
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    h-8 w-8
                    animate-spin
                    rounded-full
                    border-2
                    border-[#E7DED2]
                    border-t-velora-gold
                  "
                />

                <p className="mt-3 text-sm font-medium text-velora-dark">
                  Chargement des clients...
                </p>

                <p className="mt-1 text-xs text-velora-textGray">
                  Veuillez patienter
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* =================================================
                  DESKTOP
              ================================================= */}

              <div
                className="
                  hidden
                  overflow-hidden
                  rounded-2xl
                  border border-[#E7DED2]
                  bg-white
                  shadow-[0_8px_28px_rgba(17,17,17,0.035)]
                  md:block
                "
              >
                {/* HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b border-[#E7DED2]
                    bg-[#FCFAF7]
                    px-5
                    py-4
                  "
                >
                  <div>
                    <p className="text-sm font-semibold text-velora-dark">
                      Liste des clients
                    </p>

                    <p className="mt-0.5 text-[11px] text-velora-textGray">
                      Coordonnées et historique d’achat
                    </p>
                  </div>

                  <div
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-xl
                      border border-[#E7DED2]
                      bg-white
                      text-velora-gold
                    "
                  >
                    <Users size={16} />
                  </div>
                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px]">
                    <thead className="border-b border-[#E7DED2]">
                      <tr
                        className="
                          text-left
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-[#8D8176]
                        "
                      >
                        <th className="px-5 py-4">
                          Client
                        </th>

                        <th className="px-5 py-4">
                          Contact
                        </th>

                        <th className="px-5 py-4">
                          Adresse
                        </th>

                        <th className="px-5 py-4">
                          Commandes
                        </th>

                        <th className="px-5 py-4">
                          Total
                        </th>

                        <th className="px-5 py-4">
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
                          <td colSpan="7">
                            <EmptyState
                              search={search}
                              onClear={() =>
                                setSearch("")
                              }
                            />
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map(
                          (client) => (
                            <tr
                              key={client._id}
                              className="
                                group
                                transition-colors
                                duration-200
                                hover:bg-[#FEFCF9]
                              "
                            >
                              {/* CLIENT */}

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <ClientAvatar
                                    name={
                                      client.name
                                    }
                                  />

                                  <div className="min-w-0">
                                    <p
                                      className="
                                        truncate
                                        text-xs
                                        font-semibold
                                        text-velora-dark
                                        lg:text-sm
                                      "
                                    >
                                      {client.name ||
                                        "Client"}
                                    </p>

                                    <span
                                      className="
                                        mt-1
                                        inline-flex
                                        rounded-full
                                        bg-[#FBF4E9]
                                        px-2
                                        py-0.5
                                        text-[8px]
                                        font-bold
                                        uppercase
                                        tracking-[0.08em]
                                        text-velora-gold
                                      "
                                    >
                                      {client.role ||
                                        "Client"}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* CONTACT */}

                              <td className="px-5 py-4">
                                <div className="space-y-1.5">
                                  <p className="flex max-w-[230px] items-center gap-2 truncate text-xs text-velora-dark">
                                    <Mail
                                      size={13}
                                      className="shrink-0 text-velora-gold"
                                    />

                                    <span className="truncate">
                                      {client.email ||
                                        "-"}
                                    </span>
                                  </p>

                                  <p className="flex items-center gap-2 text-xs text-velora-textGray">
                                    <Phone
                                      size={13}
                                      className="shrink-0"
                                    />

                                    {client.phone ||
                                      "-"}
                                  </p>
                                </div>
                              </td>

                              {/* ADRESSE */}

                              <td className="px-5 py-4">
                                <div className="max-w-[190px] text-xs leading-5">
                                  <p className="truncate font-medium text-velora-dark">
                                    {client.address
                                      ?.street ||
                                      "-"}
                                  </p>

                                  <p className="text-velora-textGray">
                                    {client.address
                                      ?.city ||
                                      ""}{" "}
                                    {client.address
                                      ?.zipCode ||
                                      ""}
                                  </p>
                                </div>
                              </td>

                              {/* COMMANDES */}

                              <td className="px-5 py-4">
                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    border
                                    border-[#E7DED2]
                                    bg-[#FBF8F2]
                                    px-2.5
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-velora-dark
                                  "
                                >
                                  <ShoppingCart
                                    size={13}
                                    className="text-velora-gold"
                                  />

                                  {client.ordersCount ||
                                    0}
                                </span>
                              </td>

                              {/* TOTAL */}

                              <td className="px-5 py-4">
                                <span className="whitespace-nowrap text-xs font-bold text-velora-dark lg:text-sm">
                                  {formatMoney(
                                    client.totalSpent
                                  )}
                                </span>
                              </td>

                              {/* DATE */}

                              <td className="px-5 py-4">
                                <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-velora-textGray">
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
                                    inline-flex
                                    h-9 w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-[#F0D8D5]
                                    bg-[#FFF8F7]
                                    text-[#B85D55]
                                    transition-all
                                    duration-200
                                    hover:border-[#E7B9B4]
                                    hover:bg-[#B85D55]
                                    hover:text-white
                                    active:scale-95
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                  "
                                  title="Supprimer le client"
                                >
                                  {deletingId ===
                                  client._id ? (
                                    <span
                                      className="
                                        h-4 w-4
                                        animate-spin
                                        rounded-full
                                        border-2
                                        border-[#E7B9B4]
                                        border-t-[#B85D55]
                                      "
                                    />
                                  ) : (
                                    <Trash2
                                      size={16}
                                      strokeWidth={1.8}
                                    />
                                  )}
                                </button>
                              </td>
                            </tr>
                          )
                        )
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
                  <div
                    className="
                      rounded-2xl
                      border border-[#E7DED2]
                      bg-white
                      shadow-[0_8px_28px_rgba(17,17,17,0.035)]
                    "
                  >
                    <EmptyState
                      search={search}
                      onClear={() =>
                        setSearch("")
                      }
                    />
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client._id}
                      className="
                        overflow-hidden
                        rounded-2xl
                        border border-[#E7DED2]
                        bg-white
                        shadow-[0_8px_28px_rgba(17,17,17,0.035)]
                      "
                    >
                      {/* CARD HEADER */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          border-b border-[#F1E9DF]
                          bg-[#FCFAF7]
                          p-4
                        "
                      >
                        <ClientAvatar
                          name={client.name}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-velora-dark">
                            {client.name ||
                              "Client"}
                          </p>

                          <span
                            className="
                              mt-1
                              inline-flex
                              rounded-full
                              bg-[#FBF4E9]
                              px-2
                              py-0.5
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.08em]
                              text-velora-gold
                            "
                          >
                            {client.role ||
                              "Client"}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-velora-dark">
                            {formatMoney(
                              client.totalSpent
                            )}
                          </p>

                          <p className="mt-0.5 text-[9px] text-velora-textGray">
                            Total achats
                          </p>
                        </div>
                      </div>

                      {/* CARD BODY */}

                      <div className="space-y-3 p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="
                              flex h-8 w-8
                              shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-[#FBF4E9]
                              text-velora-gold
                            "
                          >
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

                        <div className="flex items-start gap-3">
                          <div
                            className="
                              flex h-8 w-8
                              shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-[#FBF4E9]
                              text-velora-gold
                            "
                          >
                            <Phone size={14} />
                          </div>

                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Téléphone
                            </p>

                            <p className="mt-1 text-xs text-velora-dark">
                              {client.phone || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div
                            className="
                              flex h-8 w-8
                              shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-[#FBF4E9]
                              text-velora-gold
                            "
                          >
                            <User size={14} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-velora-textGray">
                              Adresse
                            </p>

                            <p className="mt-1 text-xs leading-5 text-velora-dark">
                              {client.address
                                ?.street ||
                                "-"}
                              <br />
                              {client.address
                                ?.city ||
                                ""}{" "}
                              {client.address
                                ?.zipCode ||
                                ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CARD FOOTER */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          border-t border-[#F1E9DF]
                          bg-[#FCFAF7]
                          px-4
                          py-3
                        "
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="
                              flex h-7 w-7
                              items-center justify-center
                              rounded-lg
                              bg-[#FBF4E9]
                              text-velora-gold
                            "
                          >
                            <ShoppingCart
                              size={13}
                            />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-velora-dark">
                              {client.ordersCount ||
                                0}{" "}
                              commande
                              {Number(
                                client.ordersCount ||
                                  0
                              ) > 1
                                ? "s"
                                : ""}
                            </p>

                            <p className="text-[9px] text-velora-textGray">
                              Inscrit le{" "}
                              {formatDate(
                                client.createdAt
                              )}
                            </p>
                          </div>
                        </div>

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
                            inline-flex
                            h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#F0D8D5]
                            bg-[#FFF8F7]
                            text-[#B85D55]
                            transition-all
                            duration-200
                            hover:border-[#E7B9B4]
                            hover:bg-[#B85D55]
                            hover:text-white
                            active:scale-95
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                          title="Supprimer le client"
                        >
                          {deletingId ===
                          client._id ? (
                            <span
                              className="
                                h-4 w-4
                                animate-spin
                                rounded-full
                                border-2
                                border-[#E7B9B4]
                                border-t-[#B85D55]
                              "
                            />
                          ) : (
                            <Trash2
                              size={15}
                              strokeWidth={1.8}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}