import Card from "../ui/Card";
import Button from "../ui/Button";
import { Clock3, Bus, Users, Navigation } from "lucide-react";

export default function BottomSheet({ nearest = [], eta, onWait }) {
  const vehicle = nearest[0];

  return (
    <div className="bottom-sheet">
      <Card>
        <h3>Nearest Vehicle</h3>

        {vehicle ? (
          <>
            <div className="sheet-row">
              <Bus size={18} />
              <span>{vehicle.id}</span>
            </div>

            <div className="sheet-row">
              <Navigation size={18} />
              <span>{vehicle.route}</span>
            </div>

            <div className="sheet-row">
              <Clock3 size={18} />
              <span>ETA {eta?.eta_minutes ?? "--"} mins</span>
            </div>

            <div className="sheet-row">
              <Users size={18} />
              <span>Capacity Available</span>
            </div>
          </>
        ) : (
          <p>No nearby vehicles.</p>
        )}

        <Button
          style={{
            width: "100%",
            marginTop: 20,
          }}
          onClick={onWait}
        >
          I'm Waiting
        </Button>
      </Card>
    </div>
  );
}
