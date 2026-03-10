import { Grid } from "@/web/components/core/Grid";
import { TextBlock } from "@/web/components/core/TextBlock";
import { Column } from "@/web/components/core/Column";
import { LoadingSpinner } from "@/web/components/LoadingSpinner";
import { Strong } from "@/web/components/core/Strong";
import { UilRedo } from "@/web/components/icons/UilRedo";
import { Button } from "@/web/components/button/Button";
import { useStaticData } from "@/web/utils/use-static-data";

type SplashScreenProps = {
  error: boolean;
  onRetry: () => void;
};

export function SplashScreen(props: SplashScreenProps) {
  const { appName } = useStaticData();

  return (
    <Grid class="w-svw h-svh items-center justify-center">
      <Column class="gap-12" xAlign="center">
        <Column class="gap-6" xAlign="center">
          <img class="w-24 h-24" src="/favicon.svg" />
          <TextBlock style="title">{appName}</TextBlock>
        </Column>
        {props.error ? (
          <Column class="gap-4" xAlign="center">
            <TextBlock>
              Failed to load data. <Strong>😭</Strong>
            </TextBlock>
            <Button text="Retry" icon={UilRedo} onClick={props.onRetry} />
          </Column>
        ) : (
          <LoadingSpinner style="large" />
        )}
      </Column>
    </Grid>
  );
}
