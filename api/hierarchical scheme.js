import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const hierarchyData = {
  title: "Main Idea",
  children: [
    {
      title: "Sub Idea 1",
      children: [{ title: "Detail 1" }, { title: "Detail 2" }],
    },
    {
      title: "Sub Idea 2",
      children: [{ title: "Detail 3" }],
    },
  ],
};

const Node = ({ node, level = 0 }) => {
  return (
    <div className={`ml-${level * 4} mt-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="rounded-3xl shadow-lg">
          <CardContent className="p-6 text-base font-semibold text-center">
            {node.title}
          </CardContent>
        </Card>
      </motion.div>

      {node.children && (
        <div className="ml-8 border-l pl-6">
          {node.children.map((child, i) => (
            <Node key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function HierarchicalSchemeDesign() {
  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-start">
      <h1 className="text-3xl font-bold mb-8">Hierarchical Scheme Output</h1>
      <Node node={hierarchyData} />
    </div>
  );
} 
