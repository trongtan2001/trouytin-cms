import { convenients } from "@/ultils/constant"

const Convenient = ({ convenient = [], onChange }) => {
  const handleSelect = (isChecked, value) => {
    if (isChecked) onChange([...convenient.filter((el) => el !== value), value])
    else onChange([...convenient.filter((el) => el !== value)])
  }
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-medium">
        Tiện nghi{" "}
        <span className="text-xs italic font-normal">{`(Không bắt buộc)`}</span>
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {convenients.map((el) => (
          <div key={el.id} className="col-span-1 flex items-center gap-3">
            <input
              onChange={(e) => handleSelect(e.target.checked, el.name)}
              type="checkbox"
              name="convenient"
              id={el.id}
              checked={convenient?.some((n) => n.trim() === el.name?.trim())}
            />
            <label htmlFor={el.id}>{el.name}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Convenient
