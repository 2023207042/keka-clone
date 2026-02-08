
// Sample Org Data
type Person = {
  id: number;
  name: string;
  role: string;
  image: string;
  children?: Person[];
};

const data: Person = {
  id: 1,
  name: "John Doe",
  role: "President",
  image: "https://i.pravatar.cc/150?img=1",
  children: [
    {
      id: 2,
      name: "Jane Doe",
      role: "VP Marketing",
      image: "https://i.pravatar.cc/150?img=5",
      children: [
        {
          id: 6,
          name: "Kim Young",
          role: "Marketing Manager",
          image: "https://i.pravatar.cc/150?img=12",
        },
      ],
    },
    {
      id: 3,
      name: "James Newman",
      role: "VP Sales",
      image: "https://i.pravatar.cc/150?img=8",
      children: [
        {
          id: 7,
          name: "Beth Mathews",
          role: "Partner",
          image: "https://i.pravatar.cc/150?img=20",
        },
        {
          id: 8,
          name: "Steven Evans",
          role: "Partner",
          image: "https://i.pravatar.cc/150?img=21",
        },
      ],
    },
    {
      id: 4,
      name: "Joe Maxman",
      role: "VP Production",
      image: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 5,
      name: "Henry Sherman",
      role: "VP Operations",
      image: "https://i.pravatar.cc/150?img=30",
      children: [
        {
          id: 9,
          name: "Janet Doe",
          role: "Partner",
          image: "https://i.pravatar.cc/150?img=32",
          children: [
            {
              id: 10,
              name: "Desmond James",
              role: "Associate",
              image: "https://i.pravatar.cc/150?img=40",
            },
          ],
        },
      ],
    },
  ],
};

const Card = ({ person }: { person: Person }) => (
  <div className="flex flex-col items-center">
    <img
      src={person.image}
      className="w-20 h-20 rounded-full border-4 border-teal-500 shadow-lg"
    />
    <div className="mt-2 text-center">
      <div className="text-sm font-semibold text-gray-800">{person.name}</div>
      <div className="text-xs text-gray-500">{person.role}</div>
    </div>
  </div>
);

const OrgNode = ({ person }: { person: Person }) => {
  return (
    <div className="flex flex-col items-center">
      <Card person={person} />

      {person.children && (
        <>
          <div className="w-px h-10 bg-gray-300 my-2" />
          <div className="flex gap-10 border-t border-gray-300 pt-8">
            {person.children.map((child) => (
              <OrgNode key={child.id} person={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function CompanyHierarchy() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold tracking-wide mb-10">
          COMPANY <span className="text-teal-500">HIERARCHY</span>
        </h1>

        <div className="overflow-x-auto">
          <div className="min-w-[900px] flex justify-center">
            <OrgNode person={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
