import { memo, useState } from "react";
import { SymbolOverview } from "react-tradingview-embed";
import json from "./StockChart.json";
import Widget from "../../components/Widget/Widget";
import { WidgetWidth } from "../../utils/constants";
import { PubSubEvent, useSub } from "../../hook/usePubSub";
import { hToPx } from "../../utils/appUtils";

type Props = {
  wid: string;
  symbol: string;
};

export default function StockChart({ wid, symbol }: Props) {
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [theme, setTheme] = useState(
    localStorage.getItem("nightwind-mode") ?? "dark",
  );

  useSub(PubSubEvent.ThemeChange, () => {
    setTheme(localStorage.getItem("nightwind-mode") ?? "dark");
  });

  const Chart = memo(() => {
    return (
      <>
        <div id={wid + "-container"}></div>
        <SymbolOverview
          key={wid + "-" + theme}
          widgetProps={{
            container_id: wid + "-container",
            width: WidgetWidth - 2,
            height: hToPx(json.info.h) - 2,
            symbols: [currentSymbol],
            colorTheme: theme,
          }}
        />
      </>
    );
  });

  Chart.displayName = "Chart";
  
  return (
    <Widget
      wid={wid}
      schema={json.schema}
      w={json.info.w}
      h={json.info.h}
      cn="overflow-hidden"
      onSettings={({ settings }) => {
        setCurrentSymbol(settings?.symbol ?? symbol);
      }}
      render={() => {
        return <Chart />;
      }}
    />
  );
}
