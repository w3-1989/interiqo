type TimeOfDayGreetingProps = {
  name?: string;
};

export default function TimeOfDayGreeting({name}: TimeOfDayGreetingProps) {
  const timeOfDay = new Date().getHours();

  let greetingMsg = "";

  if (timeOfDay >= 5 && timeOfDay <= 11) {
    greetingMsg = `Rise and shine ${name}`;
  } else if (timeOfDay >= 12 && timeOfDay <= 17) {
    greetingMsg = `Afternoon, ${name}`;
  } else if (timeOfDay >= 18 || timeOfDay < 5) {
    greetingMsg = `Evening, ${name}`;
  }

  return (
    <>
      <h1 className="text-[48px] font-avant dark:text-white capitalize">
        {greetingMsg}
      </h1>
    </>
  );
}
