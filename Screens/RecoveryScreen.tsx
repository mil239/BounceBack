const { joint, answers } = route.params;

type Props = 
{
    goBack: () => void;
};

<Button title = "Back" onPress = {goBack} />