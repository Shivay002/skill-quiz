import StartQuizButton from "../components/StartQuiz";

export default function SkillsList({ skills }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Available Skills</h1>
      <div className="grid gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 border rounded">
            <h2 className="font-semibold">{skill.name}</h2>
            <StartQuizButton skillId={skill.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
