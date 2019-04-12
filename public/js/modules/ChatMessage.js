export default {
    props: ['msg'],

    template: `

    <p class='new-message slide-up-fade-in' :class="{ 'my-message' : matchedID }">
    <span>{{msg.message.name}} says:</span>
    {{msg.message.content}}
    <br>
    <span class='time'>{{msg.message.time}}</span>
</p>

    `,

    data: function()    {
        return  {
            matchedID: this.$parent.socketID == this.msg.id

        }
    }
}