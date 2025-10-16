import type { AgentResultProps } from "@/components/Agents/AgentResult";
import AgentResult from "@/components/Agents/AgentResult";

const agentExamples: AgentResultProps[] = [
    {id: 1, name: "Sarah Miller", phone: "123-456-7890", email: "sarah@example.com", propertyCount: 5, picture: "/images/sarah.jpg"},
    {id: 2, name: "John Doe", phone: "987-654-3210", email: "john@example.com", propertyCount: 3, picture: "/images/john.jpg"},
    {id: 3, name: "Jane Smith", phone: "555-555-5555", email: "jane@example.com", propertyCount: 8, picture: "/images/jane.jpg"}
]

const Agents = () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold pb-6">Find an Agent</h1>
      <ul className="list-none p-0 m-0 space-y-4">
        {agentExamples.map(agent => (
          <AgentResult key={agent.id} {...agent} />
        ))}
      </ul>
    </div>
  )
}

export default Agents
