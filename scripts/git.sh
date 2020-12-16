
# define function
addToGitignore () {

    # add filename to .gitignore
    echo "(hit q for quit)" 
    while :
    do

        read -p "Type file name to add to .gitignore: " filename
        # quit when
        if [ $filename = "q" ]
            then
                break
            else
                echo $filename >> .gitignore
        fi


    done

}
