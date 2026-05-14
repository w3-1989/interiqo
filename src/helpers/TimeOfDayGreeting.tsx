type TimeOfDayGreetingProps = {
  name?: string;
};

export default function TimeOfDayGreeting(props: TimeOfDayGreetingProps) {
  const timeOfDay = new Date().getHours();

  let greetingMsg = "";

  if (timeOfDay >= 5 && timeOfDay <= 11) {
    greetingMsg = `Rise and shine ${props.name}`;
  } else if (timeOfDay >= 12 && timeOfDay <= 17) {
    greetingMsg = `Afternoon, ${props.name}`;
  } else if (timeOfDay >= 18 || timeOfDay < 5) {
    greetingMsg = `Evening, ${props.name}`;
  }

  return (
    <>
      <h1 className="text-[48px] font-avant dark:text-white capitalize">
        {greetingMsg}
      </h1>
    </>
  );
}
